import re
<<<<<<< ours
=======
import uuid
from urllib.parse import urlparse

>>>>>>> theirs
import requests

PROXIES = {"http": "socks5://172.20.144.1:10808", "https": "socks5://172.20.144.1:10808"}
JUSTONE_TOKEN = "xsd0FmPq0XKyLbU8"


def extract_douyin_video_id(url: str) -> str:
    if "v.douyin.com" in url:
        r = requests.get(url, allow_redirects=False, timeout=15, proxies=PROXIES)
        target = r.headers.get("location", "")
    else:
        target = url
    m = re.search(r"/video/(\d+)", target)
    if not m:
        raise ValueError("无法解析抖音 video id")
    return m.group(1)


def download_video(url: str, save_path: str) -> dict:
    video_id = extract_douyin_video_id(url)
    endpoint = f"https://api.justoneapi.com/api/douyin/get-video-detail/v2?token={JUSTONE_TOKEN}&videoId={video_id}"
<<<<<<< ours
    meta = requests.get(endpoint, timeout=30, proxies=PROXIES).json()
=======
    meta = requests.post(endpoint, timeout=30, proxies=PROXIES).json()
>>>>>>> theirs
    detail = meta.get("data", {}).get("aweme_detail", {})
    play_urls = detail.get("video", {}).get("play_addr", {}).get("url_list", [])
    if not play_urls:
        raise RuntimeError("未获取到视频下载地址")
    video_url = play_urls[0]
    with requests.get(video_url, stream=True, timeout=120, proxies=PROXIES) as r:
        r.raise_for_status()
        with open(save_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 128):
                if chunk:
                    f.write(chunk)
    return {
        "title": detail.get("desc", ""),
        "author": detail.get("author", {}).get("nickname", ""),
        "duration": int(detail.get("duration", 0) / 1000),
    }
