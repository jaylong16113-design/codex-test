import cv2
from PIL import Image


def upscale_to_4k(input_path: str, output_path: str):
    try:
        from basicsr.archs.rrdbnet_arch import RRDBNet
        from realesrgan import RealESRGANer

        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
        upsampler = RealESRGANer(scale=2, model_path="weights/RealESRGAN_x2plus.pth", model=model, tile=0, tile_pad=10, pre_pad=0)
        img = cv2.imread(input_path, cv2.IMREAD_COLOR)
        output, _ = upsampler.enhance(img, outscale=2)
        output = cv2.resize(output, (3840, 2160), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(output_path, output)
    except Exception:
        img = Image.open(input_path).convert("RGB")
        img = img.resize((3840, 2160), Image.Resampling.LANCZOS)
        img.save(output_path)
