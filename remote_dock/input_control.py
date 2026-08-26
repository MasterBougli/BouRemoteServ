from __future__ import annotations

import platform
from ctypes import Structure, byref, c_long, c_uint, windll


if platform.system() != "Windows":
    raise RuntimeError("RemoteDock currently supports Windows only.")


MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004
MOUSEEVENTF_RIGHTDOWN = 0x0008
MOUSEEVENTF_RIGHTUP = 0x0010
KEYEVENTF_KEYUP = 0x0002

VK_MEDIA_NEXT_TRACK = 0xB0
VK_MEDIA_PREV_TRACK = 0xB1
VK_MEDIA_PLAY_PAUSE = 0xB3


class POINT(Structure):
    _fields_ = [("x", c_long), ("y", c_long)]


def _screen_size() -> tuple[int, int]:
    return windll.user32.GetSystemMetrics(0), windll.user32.GetSystemMetrics(1)


def _cursor_pos() -> tuple[int, int]:
    point = POINT()
    windll.user32.GetCursorPos(byref(point))
    return point.x, point.y


def _clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, value))


def move_mouse(dx: int, dy: int) -> None:
    width, height = _screen_size()
    x, y = _cursor_pos()
    windll.user32.SetCursorPos(
        _clamp(x + dx, 0, max(0, width - 1)),
        _clamp(y + dy, 0, max(0, height - 1)),
    )


def mouse_click(button: str = "left") -> None:
    if button == "right":
        down = MOUSEEVENTF_RIGHTDOWN
        up = MOUSEEVENTF_RIGHTUP
    else:
        down = MOUSEEVENTF_LEFTDOWN
        up = MOUSEEVENTF_LEFTUP
    windll.user32.mouse_event(down, 0, 0, 0, 0)
    windll.user32.mouse_event(up, 0, 0, 0, 0)


def press_media_key(vk_code: int) -> None:
    windll.user32.keybd_event(c_uint(vk_code), 0, 0, 0)
    windll.user32.keybd_event(c_uint(vk_code), 0, KEYEVENTF_KEYUP, 0)


def play_pause() -> None:
    press_media_key(VK_MEDIA_PLAY_PAUSE)


def next_track() -> None:
    press_media_key(VK_MEDIA_NEXT_TRACK)


def previous_track() -> None:
    press_media_key(VK_MEDIA_PREV_TRACK)

