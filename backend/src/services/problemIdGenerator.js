const Problem = require('../models/Problem');

/**
 * Generates an auto-incrementing unique Problem ID like 'JH-000001'
 */
const generateProblemId = async () => {
  // Sort descending by problemId string
  const latestProblem = await Problem.findOne(
    { problemId: { $regex: '^JH-\\d+$' } },
    { problemId: 1 }
  ).sort({ problemId: -1 });

  let nextNum = 1;
  if (latestProblem && latestProblem.problemId) {
    const parts = latestProblem.problemId.split('-');
    if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
      nextNum = parseInt(parts[1], 10) + 1;
    }
  }

  let candidateId = `JH-${String(nextNum).padStart(6, '0')}`;

  // Collision safety check
  while (await Problem.exists({ problemId: candidateId })) {
    nextNum += 1;
    candidateId = `JH-${String(nextNum).padStart(6, '0')}`;
  }

  return candidateId;
};

module.exports = { generateProblemId };
