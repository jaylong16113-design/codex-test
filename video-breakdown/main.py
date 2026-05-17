import json
import os
import threading
import time
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from analyzer import analyze_frame, extract_frames, summarize_timeline
from downloader import download_video
<<<<<<< ours
=======
from storyboard_gen import generate_storyboard
from upscaler import upscale_to_4k
>>>>>>> theirs

BASE = Path(__file__).parent
OUTPUTS = BASE / "outputs"
STATIC = BASE / "static"

app = FastAPI(title="Video Breakdown")
<<<<<<< ours
=======
app.mount("/outputs", StaticFiles(directory=str(OUTPUTS)), name="outputs")
app.mount("/", StaticFiles(directory=str(STATIC), html=True), name="static")
>>>>>>> theirs

TASKS = {}


def _run_task(task_id: str, url: str, face_path: str | None):
    task_dir = OUTPUTS / task_id
    frames_dir = task_dir / "frames"
<<<<<<< ours
    frames_dir.mkdir(parents=True, exist_ok=True)
=======
    storyboard_dir = task_dir / "storyboard"
    storyboard4k_dir = task_dir / "storyboard_4k"
    for d in (task_dir, frames_dir, storyboard_dir, storyboard4k_dir):
        d.mkdir(parents=True, exist_ok=True)
>>>>>>> theirs

    try:
        TASKS[task_id]["step"] = "下载中"
        video_info = download_video(url, str(task_dir / "video.mp4"))
        TASKS[task_id]["video_info"] = video_info

        TASKS[task_id]["step"] = "抽帧中"
        frames = extract_frames(str(task_dir / "video.mp4"), str(frames_dir))
        results = []

        TASKS[task_id]["step"] = "分析中"
<<<<<<< ours
        previous = None
        for idx, frame in enumerate(frames, start=1):
            try:
                analysis = analyze_frame(frame["path"], previous)
                previous = analysis
            except Exception as e:
                analysis = {"error": str(e)}
            time.sleep(0.5)
=======
        for idx, frame in enumerate(frames, start=1):
            try:
                analysis = analyze_frame(frame["path"])
            except Exception as e:
                analysis = {"error": str(e)}
            time.sleep(1)
            sb = storyboard_dir / f"{idx:03d}.png"
            sb4k = storyboard4k_dir / f"{idx:03d}.png"
            try:
                TASKS[task_id]["step"] = "生成分镜"
                generate_storyboard(frame["path"], analysis, str(sb), face_path)
                TASKS[task_id]["step"] = "4K放大"
                upscale_to_4k(str(sb), str(sb4k))
            except Exception:
                pass
>>>>>>> theirs
            results.append({
                "time": frame["time"],
                "frame_url": f"/outputs/{task_id}/frames/{idx:03d}.jpg",
                "analysis": analysis,
<<<<<<< ours
            })
            TASKS[task_id]["frames"] = results.copy()
            TASKS[task_id]["progress"] = int(idx / max(1, len(frames)) * 100)

        TASKS[task_id]["step"] = "生成文档"
        full = summarize_timeline(results)
        with open(task_dir / "analysis.json", "w", encoding="utf-8") as f:
            json.dump({"frames": results, "full_analysis": full}, f, ensure_ascii=False, indent=2)
        TASKS[task_id].update({
            "status": "completed", "progress": 100, "frames": results,
            "full_analysis": full, "step": "完成", "done": True,
        })
    except Exception as e:
        TASKS[task_id].update({"status": "failed", "error": str(e), "done": True})
=======
                "storyboard_url": f"/outputs/{task_id}/storyboard/{idx:03d}.png",
                "storyboard_4k_url": f"/outputs/{task_id}/storyboard_4k/{idx:03d}.png",
            })
            TASKS[task_id]["progress"] = int(idx / max(1, len(frames)) * 100)

        full = summarize_timeline(results)
        with open(task_dir / "analysis.json", "w", encoding="utf-8") as f:
            json.dump({"frames": results, "full_analysis": full}, f, ensure_ascii=False, indent=2)
        TASKS[task_id].update({"status": "completed", "progress": 100, "frames": results, "full_analysis": full, "step": "完成"})
    except Exception as e:
        TASKS[task_id].update({"status": "failed", "error": str(e)})
>>>>>>> theirs


@app.post("/api/analyze")
async def analyze(url: str = Form(...), face_image: UploadFile | None = File(default=None)):
    task_id = uuid.uuid4().hex[:12]
    face_path = None
    if face_image:
        task_dir = OUTPUTS / task_id
        task_dir.mkdir(parents=True, exist_ok=True)
        face_path = str(task_dir / "face.jpg")
        with open(face_path, "wb") as f:
            f.write(await face_image.read())
<<<<<<< ours
    TASKS[task_id] = {"status": "processing", "progress": 0, "step": "排队中", "frames": [], "done": False}
=======
    TASKS[task_id] = {"status": "processing", "progress": 0, "step": "排队中", "frames": []}
>>>>>>> theirs
    threading.Thread(target=_run_task, args=(task_id, url, face_path), daemon=True).start()
    return {"task_id": task_id, "status": "processing"}


@app.get("/api/tasks/{task_id}")
def get_task(task_id: str):
    return TASKS.get(task_id, {"status": "not_found"})


@app.get("/api/tasks")
def list_tasks():
    return TASKS
<<<<<<< ours


app.mount("/outputs", StaticFiles(directory=str(OUTPUTS)), name="outputs")


@app.get("/")
def index():
    from fastapi.responses import FileResponse
    return FileResponse(str(STATIC / "index.html"))


@app.get("/static/{path:path}")
def static_files(path: str):
    from fastapi.responses import FileResponse
    file_path = STATIC / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    return FileResponse(str(STATIC / "index.html"))
=======
>>>>>>> theirs
