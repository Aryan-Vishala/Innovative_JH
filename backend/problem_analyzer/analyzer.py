# from google import genai
# from google.genai import types
# from dotenv import load_dotenv
# import os

# from schemas import ProblemAnalysis
# from prompts import ANALYSIS_PROMPT


# load_dotenv()


# client = genai.Client(
#     api_key=os.getenv("GEMINI_API_KEY")
# )


# def analyze_text_problem(problem_text: str) -> ProblemAnalysis:

#     prompt = f"""
# {ANALYSIS_PROMPT}

# USER SUBMITTED PROBLEM:

# {problem_text}
# """

#     response = client.models.generate_content(
#         model="gemini-3.5-flash-lite",
#         contents=prompt,
#         config=types.GenerateContentConfig(
#             response_mime_type="application/json",
#             response_schema=ProblemAnalysis
#         )
#     )

#     return ProblemAnalysis.model_validate_json(
#         response.text
#     )



from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

from schemas import ProblemAnalysis
from prompts import ANALYSIS_PROMPT


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_text_problem(problem_text: str) -> ProblemAnalysis:

    prompt = f"""
{ANALYSIS_PROMPT}

USER SUBMITTED PROBLEM:

{problem_text}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ProblemAnalysis
        )
    )

    return ProblemAnalysis.model_validate_json(
        response.text
    )


def analyze_image_problem(image_path: str) -> ProblemAnalysis:

    image_file = client.files.upload(
        file=image_path
    )

    prompt = f"""
{ANALYSIS_PROMPT}

Analyze the uploaded image as the user's problem submission.

Identify the problem visible in the image.

Use visual evidence from the image.

Do not invent details that cannot reasonably be determined
from the image.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            image_file,
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ProblemAnalysis
        )
    )

    return ProblemAnalysis.model_validate_json(
        response.text
    )



def analyze_video_problem(video_path: str) -> ProblemAnalysis:

    print("\nUploading video to Gemini...")

    video_file = client.files.upload(
        file=video_path
    )

    print("Video uploaded.")
    print("Analyzing video...")

    prompt = f"""
{ANALYSIS_PROMPT}

Analyze the uploaded video as the user's problem submission.

Use both visual and audio information when available.

Identify:
- The main real-world problem
- Relevant visual evidence
- Relevant spoken/audio information
- Possible causes
- People or communities affected
- Potential innovation opportunities
- Relevant academic/technical disciplines

Do not invent facts that cannot reasonably be determined
from the video.

If the video does not contain enough information to determine
something, indicate the uncertainty rather than guessing.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            video_file,
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ProblemAnalysis
        )
    )

    return ProblemAnalysis.model_validate_json(
        response.text
    )






def process_submission(
    text: str | None = None,
    image_path: str | None = None,
    video_path: str | None = None
) -> ProblemAnalysis:

    contents = []

    # Add text if provided
    if text and text.strip():
        contents.append(text)

    # Add image if provided
    if image_path:
        image_file = client.files.upload(
            file=image_path
        )
        contents.append(image_file)

    # Add video if provided
    if video_path:
        video_file = client.files.upload(
            file=video_path
        )
        contents.append(video_file)

    # Nothing submitted
    if not contents:
        raise ValueError(
            "No valid submission provided."
        )

    prompt = f"""
{ANALYSIS_PROMPT}

Analyze the submitted problem using ALL available
information.

The submission may contain:
- Text
- Images
- Video
- A combination of these

Use visual information from images/videos and textual
information when available.

Combine the information rather than analyzing each
input independently.

Do not invent information that is not supported by
the submission.

Return the structured problem analysis.
"""

    contents.append(prompt)

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=contents,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ProblemAnalysis
        )
    )

    return ProblemAnalysis.model_validate_json(
        response.text
    )