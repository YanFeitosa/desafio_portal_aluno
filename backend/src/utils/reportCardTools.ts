export function calculateAverage(scores: number[]) {
  if (scores.length === 0) {
    return null;
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;

  return Number(average.toFixed(2));
}

export function calculateAcademicStatus(average: number | null) {
  if (average === null) {
    return "Sem notas";
  }

  return average >= 7 ? "Aprovado" : "Reprovado";
}