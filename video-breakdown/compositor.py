"""
compositor.py — 用 gpt-image-2 生成分镜脚本大图
将多帧场景图 + AI分析合成一张完整的分镜脚本文档
"""
import base64
import json
import os
import time
from typing import Any, Dict, List, Optional

import requests

APIMART_KEY = "sk-YUigljr9O06hsDHogF5F5npPHiixAS05A7xHdsWBSxemu3tB"
APIMART_BASE = "https://api.apimart.ai/v1"

FRAMES_PER_PAGE = 4  # 每张大图放几帧


def _image_to_url(image_path: str, max_width: int = 600) -> str:
    """压缩图片并转为 base64 data URL"""
    try:
        import cv2
        img = cv2.imread(image_path)
        if img is not None:
            h, w = img.shape[:2]
            if w > max_width:
                img = cv2.resize(img, (max_width, int(h * max_width / w)))
            import tempfile
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            tmp.close()
            cv2.imwrite(tmp.name, img, [cv2.IMWRITE_JPEG_QUALITY, 20])
            with open(tmp.name, "rb") as f:
                b64 = base64.b64encode(f.read()).decode()
            os.unlink(tmp.name)
            return f"data:image/jpeg;base64,{b64}"
    except Exception:
        pass
    # fallback: 直接读
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:image/jpeg;base64,{b64}"


def _build_page_prompt(frames_batch: List[Dict], page_num: int, total_pages: int, video_info: Optional[Dict] = None) -> str:
    """构建分镜脚本大图的 prompt"""
    title = video_info.get("title", "视频分镜") if video_info else "视频分镜"
    author = video_info.get("author", "") if video_info else ""

    shots_text = ""
    for i, f in enumerate(frames_batch):
        idx = page_num * FRAMES_PER_PAGE + i + 1
        a = f.get("analysis", {})
        fe = a.get("facial_expression", {}) or {}
        li = a.get("lighting", {}) or {}
        ca = a.get("color_analysis", {}) or {}
        nar = a.get("narrative", {}) or {}
        cha = a.get("character_action", {}) or {}

        shots_text += (
            f"[Shot {idx}] Time: {f.get('time', '--')} | "
            f"Type: {a.get('shot_type', '-')} | "
            f"Camera: {a.get('camera_movement', '-')} | "
            f"Composition: {a.get('composition', '-')} | "
            f"Scene: {a.get('scene', '-')} | "
            f"Emotion: {fe.get('primary_emotion', '-')} (intensity {fe.get('intensity', '-')}) | "
            f"Lighting: {li.get('key_light_direction', '-')}, {li.get('atmosphere', '-')} | "
            f"Color: {ca.get('temperature', '-')}, {ca.get('saturation', '-')} saturation | "
            f"Action: {cha.get('pose', '-')}, {cha.get('gesture', '-')} | "
            f"Narrative: {nar.get('beat', '-')} (tension {nar.get('tension', '-')}) | "
            f"Keywords: {', '.join(a.get('keywords', []))}\n\n"
        )

    prompt = (
        f"Create a professional storyboard document page ({page_num+1}/{total_pages}) for the video \"{title}\" "
        f"({author if author else ''}).\n\n"
        "LAYOUT REQUIREMENTS:\n"
        "- The image should look like a REAL storyboard document, with a clean structured layout\n"
        "- Each shot panel has: the scene illustration on the LEFT side, and detailed analysis text on the RIGHT side\n"
        "- Arrange all shots vertically from top to bottom\n"
        "- Each panel should have a clear border/separator line\n\n"
        "CONTENT FOR EACH PANEL (use the REFERENCE IMAGES for the scene visuals, "
        "and add the analysis text based on these descriptions):\n\n"
        f"{shots_text}\n"
        "STYLE:\n"
        "- Professional storyboard document look, cream/off-white paper background\n"
        "- Scene illustrations in blueprint pencil sketch style, matching the reference images\n"
        "- CLEAN READABLE ENGLISH TEXT for all labels and descriptions\n"
        "- Shot numbers in circles\n"
        "- Title header at the top of the page: 'STORYBOARD - [title] Page [num]/[total]'\n"
        "- Timecodes displayed clearly for each shot\n"
        "- Clean, minimal, professional design - like an actual film production storyboard\n\n"
        "IMPORTANT: Generate the ENTIRE page as one image with ALL shots arranged vertically. "
        "Use the uploaded reference images as the visual basis for each shot's scene, "
        "and overlay/add the text descriptions as shown above."
    )
    return prompt


def generate_composite_page(
    frames_batch: List[Dict],
    page_num: int,
    total_pages: int,
    output_path: str,
    video_info: Optional[Dict] = None,
) -> bool:
    """用 gpt-image-2 生成一页分镜脚本大图"""
    # 收集这一批的所有场景图片
    image_urls = []
    for f in frames_batch:
        scene_img = f.get("_scene_image_path")
        if scene_img and os.path.exists(scene_img):
            url = _image_to_url(scene_img)
            image_urls.append(url)

    if not image_urls:
        print(f"[compositor] Page {page_num}: no scene images found, skipping")
        return False

    prompt = _build_page_prompt(frames_batch, page_num, total_pages, video_info)

    print(f"[compositor] Page {page_num+1}/{total_pages}: submitting {len(image_urls)} images...")

    # 提交
    try:
        submit = requests.post(
            f"{APIMART_BASE}/images/generations",
            headers={"Authorization": f"Bearer {APIMART_KEY}", "Content-Type": "application/json"},
            json={
                "model": "gpt-image-2",
                "prompt": prompt,
                "size": "2560x1440",
                "n": 1,
                "image_urls": image_urls,
            },
            timeout=60,
        ).json()
    except Exception as e:
        print(f"[compositor] Submit error: {e}")
        return False

    try:
        task_id = submit["data"][0]["task_id"]
    except Exception:
        print(f"[compositor] Submit failed: {submit}")
        return False

    # 轮询
    deadline = time.time() + 180  # 3 min for composite
    img_url = None
    while time.time() < deadline:
        try:
            res = requests.get(
                f"{APIMART_BASE}/tasks/{task_id}",
                headers={"Authorization": f"Bearer {APIMART_KEY}"},
                timeout=30,
            ).json()
            data = res.get("data", {})
            imgs = data.get("result", {}).get("images", [])
            if imgs:
                urls = imgs[0].get("url", [])
                if urls:
                    img_url = urls[0]
                    break
            if data.get("status") in ("failed", "error"):
                print(f"[compositor] gpt-image-2 failed: {data.get('error', '?')}")
                return False
        except Exception as poll_err:
            print(f"[compositor] poll: {poll_err}")
        time.sleep(5)

    if not img_url:
        print(f"[compositor] Page {page_num}: timeout")
        return False

    # 下载
    try:
        data = requests.get(img_url, timeout=60).content
        with open(output_path, "wb") as f:
            f.write(data)
        print(f"[compositor] Page {page_num+1} saved: {output_path} ({len(data)/1024:.0f}KB)")
        return True
    except Exception as e:
        print(f"[compositor] Download error: {e}")
        return False


def generate_all_pages(
    frames: List[Dict],
    output_dir: str,
    video_info: Optional[Dict] = None,
    frames_per_page: int = FRAMES_PER_PAGE,
) -> List[str]:
    """
    将所有帧分页生成分镜脚本大图
    返回生成的图片路径列表
    """
    pages = []
    total = len(frames)
    total_pages = max(1, (total + frames_per_page - 1) // frames_per_page)

    for p in range(total_pages):
        start = p * frames_per_page
        end = min(start + frames_per_page, total)
        batch = frames[start:end]
        out_path = os.path.join(output_dir, f"storyboard_page_{p+1:02d}.png")
        ok = generate_composite_page(batch, p, total_pages, out_path, video_info)
        if ok:
            pages.append(out_path)

    return pages
