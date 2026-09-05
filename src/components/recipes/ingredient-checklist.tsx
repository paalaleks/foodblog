"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldLabel,
} from "@/components/ui/field";

export function IngredientChecklist({
  ingredients,
}: {
  ingredients: string[];
}) {
  const prefix = useId();
  return (
    <FieldSet className="ingredient-checklist">
      <FieldLegend className="sr-only">Ingredient checklist</FieldLegend>
      <FieldGroup>
        {ingredients.map((ingredient, index) => (
          <Field orientation="horizontal" key={`${index}-${ingredient}`}>
            <Checkbox id={`${prefix}-${index}`} />
            <FieldLabel htmlFor={`${prefix}-${index}`}>{ingredient}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
