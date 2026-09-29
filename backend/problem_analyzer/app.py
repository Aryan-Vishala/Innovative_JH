# # from google import genai
# # from dotenv import load_dotenv
# # import os

# # load_dotenv()

# # client = genai.Client(
# #     api_key=os.getenv("GEMINI_API_KEY")
# # )

# # response = client.models.generate_content(
# #     model="gemini-3.5-flash-lite",
# #     contents="Explain in one sentence what a real-world problem means."
# # )

# # print(response.text)

# # from analyzer import analyze_text_problem


# # problem = input("\nDescribe the problem:\n> ")


# # result = analyze_text_problem(problem)


# # print("\n========== PROBLEM ANALYSIS ==========\n")

# # print(result.model_dump_json(indent=2))


# # from analyzer import analyze_image_problem


# # image_path = input(
# #     "\nEnter the path of the image:\n> "
# # )


# # result = analyze_image_problem(image_path)


# # print("\n========== IMAGE PROBLEM ANALYSIS ==========\n")

# # print(result.model_dump_json(indent=2))


# from analyzer import analyze_video_problem


# video_path = input(
#     "\nEnter the path of the video:\n> "
# )


# result = analyze_video_problem(video_path)


# print("\n========== VIDEO PROBLEM ANALYSIS ==========\n")

# print(result.model_dump_json(indent=2))



from analyzer import process_submission


def main():
    """
    AI pipeline entry point.

    In the actual application, the frontend/backend will call
    process_submission() with whatever inputs the user submitted.

    For now, these are test inputs.
    """

    text = """
    Farmers in our village are unable to identify crop diseases
    at an early stage. By the time they notice visible symptoms,
    a large portion of the crop is already damaged.
    """

    image_path = None
    video_path = None

    result = process_submission(
        text=text,
        image_path=image_path,
        video_path=video_path
    )

    # JSON output for the next pipeline
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()