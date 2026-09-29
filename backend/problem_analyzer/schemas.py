from pydantic import BaseModel, Field
from typing import List


class ProblemAnalysis(BaseModel):

    category: str = Field(
        description="Main category of the problem"
    )

    sub_category: str = Field(
        description="More specific sub-category"
    )

    problem_title: str = Field(
        description="Short title describing the problem"
    )

    problem_summary: str = Field(
        description="Clear summary of the problem"
    )

    root_causes: List[str] = Field(
        description="Possible causes of the problem"
    )

    affected_domains: List[str] = Field(
        description="Domains affected by the problem"
    )

    affected_people: str = Field(
        description="People or communities affected"
    )

    severity: str = Field(
        description="Estimated severity: low, medium, or high"
    )

    innovation_opportunities: List[str] = Field(
        description="Potential areas where students could develop innovations"
    )

    required_disciplines: List[str] = Field(
        description="Academic or engineering disciplines relevant to solving the problem"
    )

    evidence: List[str] = Field(
        description="Evidence present in the submitted problem"
    )

    confidence: float = Field(
        description="Confidence in the analysis, between 0 and 1"
    )