import base64
import os
import time

import requests

PROXIES = {"http": "socks5://172.20.144.1:10808", "https": "socks5://172.20.144.1:10808"}
APIMART_KEY = "sk-YUigljr9O06hsDHogF5F5npPHiixAS05A7xHdsWBSxemu3tB"
APIMART_BASE = "https://api.apimart.com/v1"


def generate_storyboard(frame_path: str, analysis: dict, out_path: str, face_path: str | None = None):
    with open(frame_path, "rb") as f:
        frame_data = f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode()}"
    image_urls = [frame_data]
    if face_path and os.path.exists(face_path):
        with open(face_path, "rb") as f:
            image_urls.append(f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode()}")

    prompt = (
        f"A cinematic storyboard frame in clean sketch style. {analysis.get('shot_type','中景')} of {analysis.get('scene','scene')}. "
        f"Camera: {analysis.get('camera_movement','固定')}. Lighting: {analysis.get('lighting',{})}. "
        f"Character: {analysis.get('character_action',{})} and {analysis.get('facial_expression',{})}. "
        f"Composition: {analysis.get('composition','三分法')}. "
        "Style: professional storyboard, blue pencil sketch on cream paper, numbered panel, include camera direction arrows as subtle overlays."
    )

    submit = requests.post(
        f"{APIMART_BASE}/images/generations",
        headers={"Authorization": f"Bearer {APIMART_KEY}", "Content-Type": "application/json"},
        json={"model": "gpt-image-2", "prompt": prompt, "size": "2560x1440", "n": 1, "image_urls": image_urls},
        proxies=PROXIES,
        timeout=60,
    ).json()
    task_id = submit.get("task_id") or submit.get("id")
    if not task_id:
        raise RuntimeError("未返回任务ID")

    deadline = time.time() + 120
    img_url = None
    while time.time() < deadline:
        res = requests.get(
            f"{APIMART_BASE}/tasks/{task_id}",
            headers={"Authorization": f"Bearer {APIMART_KEY}"},
            proxies=PROXIES,
            timeout=30,
        ).json()
        img_url = (((res.get("result") or {}).get("images") or [{}])[0].get("url") or [None])[0]
        if img_url:
            break
        time.sleep(4)
    if not img_url:
        raise TimeoutError("gpt-image-2 超时")
    data = requests.get(img_url, timeout=60, proxies=PROXIES).content
    with open(out_path, "wb") as f:
        f.write(data)
