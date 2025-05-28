import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { ICategory } from "../../common/interfaces/Category";
import { Input } from "./Input";

interface MultipleSelectProps {
  data?: ICategory[];
  onCategorySelect: (selectedCategory: ICategory[]) => void;
  categorySelect?: ICategory[];
}
const MultipleSelect = forwardRef<HTMLInputElement, MultipleSelectProps>(
  ({ data, onCategorySelect, categorySelect }, ref) => {
    const categoryOptions: ICategory[] = data || [];
    const [query, setQuery] = useState<string>("");
    // const [selected, setSelected] = useState<ICategory[]>([]);
    const [selected, setSelected] = useState<ICategory[]>(categorySelect || []);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);
    useEffect(() => {
      onCategorySelect(selected);
    }, [selected]);
    useEffect(() => {
      if (categorySelect) {
        setSelected(categorySelect);
      }
    }, [categorySelect]);
    const filteredTags = categoryOptions.filter(
      (item: ICategory) =>
        item.name?.includes(query.toLocaleLowerCase()?.trim()) &&
        !selected.find((selectedItem) => selectedItem.name === item.name)
    );

    return (
      <div className="flex flex-row-reverse">
        {selected?.length ? (
          <div className="bg-white w-80 relative text-xs flex flex-wrap gap-1 p-2">
            {selected.map((tag: ICategory) => {
              return (
                <div
                  key={tag.name}
                  className="rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500
                      flex items-center gap-2"
                >
                  {tag.name}
                  <div
                    className="cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      setSelected(
                        selected.filter((i: ICategory) => i.name !== tag.name)
                      )
                    }
                  >
                    X
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <div className="w-full ">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.trimStart())}
              placeholder="Tìm kiếm hoặc chọn danh mục"
              onFocus={() => setMenuOpen(true)}
              onBlur={() => setMenuOpen(false)}
            />
          </div>

          {/* Menu's */}
          <div className="relative">
            {menuOpen ? (
              <div className="card absolute bg-white w-full max-h-52 mt-2 p-1 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                <ul className="w-full">
                  {filteredTags?.length ? (
                    filteredTags.map((tag: ICategory, i: number) => (
                      <li
                        key={i}
                        className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setMenuOpen(true);
                          setSelected((prev) => [...prev, tag]);
                          setQuery("");
                        }}
                      >
                        {tag.name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No options available</li>
                  )}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export default MultipleSelect;
