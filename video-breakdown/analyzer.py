import base64
import json
import os
import subprocess
<<<<<<< ours
import tempfile
import time
from datetime import timedelta
from typing import Any, Dict, List, Optional
=======
import time
from datetime import timedelta
>>>>>>> theirs

import cv2
import imageio_ffmpeg
import requests

PROXIES = {"http": "socks5://172.20.144.1:10808", "https": "socks5://172.20.144.1:10808"}
APIMART_KEY = "sk-YUigljr9O06hsDHogF5F5npPHiixAS05A7xHdsWBSxemu3tB"
<<<<<<< ours
APIMART_BASE = "https://api.apimart.ai/v1"

DIRECTOR_PROMPT = """你是一位顶级的电影导演和分镜师，正在为这部电影做逐帧分析。你现在看到的这个画面是视频中的一帧，请以极致的细节输出JSON格式分析，包含以下所有字段：

1. precise_time: 该帧在视频中的精确时间位置（秒，精确到0.1秒），根据画面内容推测

2. shot_type: 景别（大特写/特写/近景/中近景/中景/美式中景/全景/远景/大远景/过肩镜头）

3. camera_movement: 运镜详细描述，包含移动方向和速度（例如"从右向左缓慢横移，速度约5cm/s"、"极慢推进，约0.5m/3s"、"固定镜头但微不可见的呼吸感抖动"）

4. composition: 构图详细分析（三分法/中心构图/对称构图/对角线/框架构图/引导线/黄金螺旋/负空间/三角形构图/留白构图），并描述主体在画面中的位置和占比

5. color_analysis: {
    "palette": ["#色值1","#色值2","#色值3","#色值4","#色值5"],  // 提取5个主色调
    "temperature": "暖调/冷调/中性/混合",
    "saturation": "高饱和/中饱和/低饱和/黑白",
    "contrast": "高对比/中对比/低对比/柔对比",
    "dominant_color": "画面主色调描述",
    "color_grading": "调色风格（胶片感/数码感/高调/低调/日系/赛博朋克等）"
   }

6. lighting: {
    "key_light_direction": "主光方向（侧光/前侧光/顺光/逆光/侧逆光/顶光/底光/多光源），并描述光线角度",
    "fill_light": "补光情况",
    "atmosphere": "整体光影氛围详细描述（例如：昏暗的暖色调房间，只有右侧窗户透入的夕阳形成强烈的明暗对比）",
    "shadow_type": "阴影类型（硬阴影/柔阴影/无阴影/半阴影），描述阴影的形状和位置",
    "light_source": "光源类型（自然光/人工光/混合光/烛光/霓虹灯/日光灯/聚光灯），并描述光源的数量和位置",
    "light_temperature": "色温描述（暖黄2700K/冷白5600K/混合色温等）",
    "lighting_ratio": "光比（高光比/中光比/低光比），明暗区域的比例"
   }

7. scene: 场景的极其详细描述，包括：环境氛围、空间布局、背景元素、道具摆放、建筑风格、季节/时间暗示（至少50字）

8. character_action: {
    "pose": "人物姿势的详细描述（包括身体朝向、重心分布、四肢位置等）",
    "movement": "运动轨迹和速度的详细描述（例如：从画面左侧向右缓步走来，步伐频率约每分钟60步，步幅约30cm）",
    "gesture": "手势和动作细节（手指位置、手腕角度、动作幅度等微细描述）",
    "head_position": "头部朝向和倾斜角度",
    "body_language": "肢体语言解读（开放/封闭/紧张/放松/防御/攻击等）",
    "interaction": "人物间互动或与环境/物体的互动方式",
    "clothing": "服装细节（款式、颜色、材质、褶皱、随风飘动等）",
    "spatial_relation": "人物在空间中的位置关系和与其他物体的距离"
   }

9. facial_expression: {
    "primary_emotion": "主要情绪（精确描述，如：克制中的愤怒、略带紧张的微笑、若有所思的迷茫等）",
    "intensity": 0.0-1.0,  // 情绪强度
    "micro_details": {
      "eyebrows": "眉毛详细状态（上扬/下压/皱起/不对称等，描述肌肉运动）",
      "eyes": "眼神详细描述（睁大程度、视线方向、是否闪烁、瞳孔估计状态、上下眼睑位置）",
      "mouth": "嘴部详细状态（微张/紧闭/单侧上扬/下撇/嘴唇是否干燥等）",
      "nasolabial_folds": "鼻唇沟深度和形态",
      "muscle_tension": "面部肌肉整体紧张程度及具体部位",
      "blink_rate": "眨眼频率估计"
    },
    "emotion_change": "与上一帧的情绪渐变描述（例如：与前帧相比，眉头上扬了约2mm，嘴角从放松变为微微下压，眼角皱纹加深，整体从平静转向微怒）"
   }

10. narrative: {
     "beat": "当前故事节拍的详细描述",
     "tension": 0.0-1.0,  // 戏剧张力
     "pacing": "快/中/慢/极慢，并描述节奏感",
     "narrative_function": "这个镜头在叙事中的作用"
    }

11. cinematography: {
     "lens": "推测的镜头焦距（广角/标准/长焦/微距等）",
     "aperture": "推测的光圈大小（景深描述：浅景深/深景深/中等）",
     "focus": "对焦方式（手动跟焦/自动对焦/变焦/柔焦），焦点的位置",
     "camera_height": "机位高度（俯拍/平拍/仰拍/极低角度/上帝视角）",
     "camera_distance": "相机到主体的估计距离"
    }

12. audio_implied: 从画面推测的音频信息（环境音、对话语气、音乐暗示、音效等）

13. keywords: ["精确关键词1","精确关键词2","精确关键词3","精确关键词4","精确关键词5"]
    // 至少5个关键词，涵盖：情绪、动作、视觉元素、技术术语

+13. watermarks: 请完全忽略画面上的水印、固定文字、平台LOGO、账号名称、时间戳等UI叠加元素，只分析视频本身的画面内容

请用极致的细节输出JSON，每个字段都要认真填充。基于画面中的视觉线索做专业推断。
只返回纯JSON，不要markdown代码块，不要其他文字。"""


def _get_duration(video_path: str) -> float:
    """Get video duration using OpenCV (most reliable)."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return 0.0
    fps = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    if fps > 0 and total > 0:
        return total / fps
=======
APIMART_BASE = "https://api.apimart.com/v1"

PROMPT = "你是一位资深电影导演和分镜师。分析这个视频帧画面，输出严格的JSON格式，包含以下所有字段：1. shot_type 2. camera_movement 3. composition 4. color_analysis 5. lighting 6. scene 7. character_action 8. facial_expression 9. narrative 10. keywords。只返回JSON，不要其他文字。"


def _get_duration(video_path: str) -> float:
    ffprobe = imageio_ffmpeg.get_ffmpeg_exe()
    out = subprocess.check_output([ffprobe, "-i", video_path, "-hide_banner"], stderr=subprocess.STDOUT, text=True)
    for line in out.splitlines():
        if "Duration:" in line:
            dur = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = dur.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
>>>>>>> theirs
    return 0.0


def extract_frames(video_path: str, out_dir: str):
    os.makedirs(out_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    duration = _get_duration(video_path)
<<<<<<< ours
    # 只看前30秒
    max_duration = min(duration, 30)
    # 均匀取8帧
    num_frames = 8
    if max_duration < 4:
        # 极短视频（<4秒）也尽量取密集帧
        times = [int(i * max_duration / num_frames) for i in range(num_frames)]
    else:
        times = [int(i * max_duration / (num_frames - 1)) for i in range(num_frames)]
    times = [t for t in times if t < max_duration]
=======
    step = 4 if duration <= 120 else 8
    times = list(range(0, max(1, int(duration)), step))[:30]
    if len(times) < 15 and duration > 0:
        interval = duration / 15
        times = [int(i * interval) for i in range(15)]
>>>>>>> theirs

    items = []
    for i, t in enumerate(times, start=1):
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        path = os.path.join(out_dir, f"{i:03d}.jpg")
        cv2.imwrite(path, frame)
        items.append({"time": str(timedelta(seconds=t)), "path": path})
    cap.release()
    return items


<<<<<<< ours
def _compress_image(image_path: str, max_width: int = 800, quality: int = 15) -> str:
    img = cv2.imread(image_path)
    if img is None:
        return image_path
    h, w = img.shape[:2]
    if w > max_width:
        img = cv2.resize(img, (max_width, int(h * max_width / w)))
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tmp.close()
    cv2.imwrite(tmp.name, img, [cv2.IMWRITE_JPEG_QUALITY, quality])
    return tmp.name


def analyze_frame(image_path: str, previous: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    compressed_path = _compress_image(image_path)
    try:
        with open(compressed_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")

        prompt = DIRECTOR_PROMPT
        if previous:
            prev_json = json.dumps(previous, ensure_ascii=False)[:500]
            prompt += f"\n\n上一帧分析参考: {prev_json}\n请分析emotion_change字段中的微表情变化。"

        payload = {
            "model": "gpt-4o-mini",
            "stream": False,
            "messages": [{"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}
            ]}],
            "temperature": 0.2,
        }
        res = requests.post(
            f"{APIMART_BASE}/chat/completions",
            headers={"Authorization": f"Bearer {APIMART_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=90,
        )
        res.raise_for_status()
        raw = res.json()["choices"][0]["message"]["content"]
        # 去掉可能的 markdown 代码块包裹
        raw = raw.strip()
        if raw.startswith("```"):
            # 去掉开头的 ```json 或 ``` 和结尾的 ```
            raw = raw.split("\n", 1)[-1] if "\n" in raw else raw
            raw = raw.rsplit("```", 1)[0] if "```" in raw else raw
            raw = raw.strip()
        try:
            return json.loads(raw)
        except Exception:
            return {"raw": raw}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(compressed_path):
            os.remove(compressed_path)


def summarize_timeline(frame_results: list) -> dict:
    """生成完整的导演级分镜脚本文案"""
    timeline_text = ""
    for i, fr in enumerate(frame_results):
        analysis = fr.get("analysis", {})
        if isinstance(analysis, dict) and "error" not in analysis:
            fe = analysis.get("facial_expression", {}) or {}
            ca = analysis.get("character_action", {}) or {}
            li = analysis.get("lighting", {}) or {}
            col = analysis.get("color_analysis", {}) or {}
            nar = analysis.get("narrative", {}) or {}

            timeline_text += (
                f"【镜头{i+1}】时间码：{fr['time']}\n"
                f"景别：{analysis.get('shot_type','?')}\n"
                f"运镜：{analysis.get('camera_movement','?')}\n"
                f"构图：{analysis.get('composition','?')}\n"
                f"场景：{analysis.get('scene','?')}\n"
                f"人物动作：姿势={ca.get('pose','?')}，运动={ca.get('movement','?')}，手势={ca.get('gesture','?')}，"
                f"头部={ca.get('head_position','?')}，肢体语言={ca.get('body_language','?')}\n"
                f"面部表情：情绪={fe.get('primary_emotion','?')}（强度{fe.get('intensity','?')}），"
                f"眉={fe.get('micro_details',{}).get('eyebrows','?')}，"
                f"眼={fe.get('micro_details',{}).get('eyes','?')}，"
                f"嘴={fe.get('micro_details',{}).get('mouth','?')}，"
                f"肌肉={fe.get('micro_details',{}).get('muscle_tension','?')}\n"
                f"情绪变化：{fe.get('emotion_change','?')}\n"
                f"光影：主光={li.get('key_light_direction','?')}，氛围={li.get('atmosphere','?')}，"
                f"色温={li.get('light_temperature','?')}，光比={li.get('lighting_ratio','?')}\n"
                f"色彩：主色调={col.get('dominant_color','?')}，温度={col.get('temperature','?')}，"
                f"饱和度={col.get('saturation','?')}，调色={col.get('color_grading','?')}\n"
                f"叙事：节拍={nar.get('beat','?')}，张力={nar.get('tension','?')}，节奏={nar.get('pacing','?')}\n"
                f"关键词：{', '.join(analysis.get('keywords',[]))}\n\n"
            )

    prompt = f"""你是一位顶级的电影分镜师和编剧。基于以下逐帧分析数据，生成一段**极其详细、优美流畅的中文分镜脚本文案**。

要求：
1. 这是一份给导演和摄影师看的分镜脚本，要专业、细致、有画面感
2. 每个镜头单独成段，标注时间码（精确到0.1秒）
3. 描述要充满镜头感和电影语言，让读者读完后脑海中有完整的画面
4. 写出微表情的渐变过程、光影变化、运镜节奏
5. 同时给出导演对每个镜头的意图说明
6. 总字数不少于800字
7. 使用专业电影术语
8. 格式清晰易读

以下是逐帧分析数据：

{timeline_text}

请直接输出分镜脚本文案，不要加markdown标记，不要加多余说明。"""

    try:
        res = requests.post(
            f"{APIMART_BASE}/chat/completions",
            headers={"Authorization": f"Bearer {APIMART_KEY}", "Content-Type": "application/json"},
            json={"model": "gpt-4o-mini", "stream": False, "messages": [{"role": "user", "content": prompt}], "temperature": 0.4},
            timeout=120,
        )
        res.raise_for_status()
        script = res.json()["choices"][0]["message"]["content"]
        return {"script": script}
    except Exception as e:
        return {"script": f"生成分镜脚本时出错: {e}"}
=======
def analyze_frame(image_path: str, previous=None):
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "你是导演级分镜分析助手。"},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                ],
            },
        ],
        "temperature": 0.2,
    }
    r = requests.post(
        f"{APIMART_BASE}/chat/completions",
        headers={"Authorization": f"Bearer {APIMART_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=60,
        proxies=PROXIES,
    )
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    try:
        return json.loads(text)
    except Exception:
        return {"raw": text}


def summarize_timeline(frame_results: list):
    return {
        "emotion_arc": "前段平静，中段张力提升，后段释放。",
        "action_sequence": "按帧时间线展示动作推进。",
        "micro_expression_timeline": "眉眼口在关键帧发生细微变化。",
        "director_notes": "镜头语言统一，节奏可通过缩短重复镜头进一步提升。",
    }
>>>>>>> theirs
