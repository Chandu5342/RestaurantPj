import { categories } from "@/data/menuData";

export const CategoryChips = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`chip flex-shrink-0 flex items-center gap-2 ${
            selectedCategory === category.id ? "chip-active" : "chip-inactive"
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};
