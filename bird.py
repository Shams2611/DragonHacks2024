import cv2
from taipy import Gui, Config
import numpy as np

# This function should contain your existing bird detection logic.
# It must take an OpenCV frame as input and return the processed frame.
def detect_birds_in_frame(frame):
    # Simulated detection logic: just drawing a circle on detected birds
    # You should replace this with your actual detection code.
    detected_frame = frame.copy()
    gray = cv2.cvtColor(detected_frame, cv2.COLOR_BGR2GRAY)
    circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1.2, 100)
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            cv2.circle(detected_frame, (x, y), r, (0, 255, 0), 4)
    return detected_frame

# Configure the file upload folder and allowed file types.
#Config.configure_file_upload("/tmp", allowed_extensions=[".mp4"])

# Define the GUI layout with file upload and two video displays.
'''def main_page(state):
    return """
    <html>
        Upload a video file (birds.mp4):
        <tp-file-upload id="upload" on_change="upload_video(_)"></tp-file-upload><br>
        Original Video:
        <tp-video id="original_video" src="{state.original_video_path}"></tp-video><br>
        Processed Video with Detected Birds:
        <tp-video id="processed_video" src="{state.processed_video_path}"></tp-video>
    </html>
    """'''

main_page = """
<|{selected_file}|file_selector|label=Upload Video|on_action=upload_video|extensions=.jpg,.png|>
<|{image}|image|width=300px|height=300px|>
<|{number_of_birds_detected} bird(s) detected|>
"""
selected_file = None
image = None
number_of_birds_detected = 0

# Handle video upload and processing.
def upload_video(state, file_path):
    state.original_video = file_path
    cap = cv2.VideoCapture(file_path)
    
    # Prepare output video writer.
    processed_video_path = "/tmp/processed_output.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(processed_video_path, fourcc, 20.0, (int(cap.get(3)), int(cap.get(4))))
    
    # Process video frame by frame.
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        processed_frame = detect_birds_in_frame(frame)
        out.write(processed_frame)
    
    cap.release()
    out.release()
    
    # Update state to show the processed video.
    state.processed_video = processed_video_path

# Create and run the GUI.
gui = Gui(page=main_page)
gui.run()