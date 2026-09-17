import type { Recipe } from "@/lib/content/recipes";
import { Markdown } from "@/components/content/markdown";
import { IngredientChecklist } from "./ingredient-checklist";
import { PrintButton } from "./print-button";

export function RecipeBody({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <div className="recipe-story">
        <Markdown>{recipe.introduction}</Markdown>
      </div>
      <section
        className="cooking-section"
        id="recipe"
        aria-labelledby="cooking-title"
      >
        <div className="cooking-heading">
          <div>
            <p className="eyebrow">LET’S MAKE SOMETHING GOOD</p>
            <h2 id="cooking-title">Into the kitchen.</h2>
          </div>
          <div className="no-print">
            <PrintButton />
          </div>
        </div>
        <div className="cooking-columns">
          <aside className="ingredients-panel">
            <div className="ingredients-heading">
              <h3>Ingredients</h3>
              {recipe.servings === undefined ? null : (
                <span>Serves {recipe.servings}</span>
              )}
            </div>
            <p className="check-hint no-print">Tick them off as you go.</p>
            <IngredientChecklist
              key={recipe.slug}
              ingredients={recipe.ingredients}
            />
          </aside>
          <div className="method-panel">
            <h3>The method</h3>
            <ol className="method-list">
              {recipe.steps.map((step, index) => (
                <li id={`step-${index + 1}`} key={`${index}-${step.text}`}>
                  <span className="step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Markdown>{step.markdown}</Markdown>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {recipe.notes && (
          <div className="recipe-notes">
            <h3>A little kitchen wisdom</h3>
            <Markdown>{recipe.notes}</Markdown>
          </div>
        )}
      </section>
    </>
  );
}
