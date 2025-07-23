import { capitalizeFirstLetter } from './helperFunctions'

export const extractNutrientLabels = (totalNutrients) => {
  return Object.values(totalNutrients)
    .filter((nutrient) => nutrient.quantity > 0)
    .map((nutrient) => nutrient.label)
}

export const extractDailyIntakeLabels = (dailyIntake) => {
  return Object.values(dailyIntake).map(
    (nutrient) => `${nutrient.label}: ${Math.round(nutrient.percent)}%`
  )
}

export const formatLogMealResponse = (apiResponse) => {
  const { nutrition, ingredients, name: mealName } = apiResponse
  const { calories, dailyIntakeReference, totalNutrients } = nutrition
  const nutrientLabels = extractNutrientLabels(totalNutrients)

  return {
    name: mealName.map(capitalizeFirstLetter).join(', '),
    calories: Math.round(calories),
    macronutrients: {
      Carbs: Math.round(totalNutrients.CHOCDF.quantity),
      Sugar: Math.round(totalNutrients.SUGAR.quantity),
      protein: Math.round(totalNutrients.PROCNT.quantity),
      fats: Math.round(totalNutrients.FAT.quantity)
    },
    ingredients,
    nutrientLabels,
    dailyIntake: extractDailyIntakeLabels(dailyIntakeReference)
  }
}
