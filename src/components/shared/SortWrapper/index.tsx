import SortableList from "react-easy-sort";

export const SortWrapper = ({
  children,
  onSortEnd,
  className,
  onPointerDown,
}: {
  children: React.ReactNode;
  className: string;
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  onPointerDown?: (e: React.PointerEvent<"div">) => void;
}) => {
  return (
    <SortableList
      onSortEnd={(oldIndex: number, newIndex: number) => {
        onSortEnd(oldIndex, newIndex);
      }}
      onPointerDown={onPointerDown}
      draggedItemClassName="dragged"
      className={className}
    >
      {children}
    </SortableList>
  );
};
