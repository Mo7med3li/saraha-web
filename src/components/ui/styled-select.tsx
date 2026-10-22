import {
  useState,
  useCallback,
  type KeyboardEvent,
  useRef,
  useMemo,
  useLayoutEffect,
  useEffect,
  type MouseEvent,
  FocusEvent,
} from "react";
import { Check, XCircle, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from "./popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Tag } from "./tags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "cn";
import { getColorFromString } from "@/src/lib/utils/get-color-string";

const solidTagColorMap: Record<string, string> = {
  blue: "#1677ff",
  purple: "#722ed1",
  cyan: "#13c2c2",
  green: "#52c41a",
  magenta: "#eb2f96",
  pink: "#eb2f96",
  red: "#ff4d4f",
  orange: "#fa8c16",
  yellow: "#faad14",
  volcano: "#fa541c",
  geekblue: "#2f54eb",
  lime: "#a0d911",
  gold: "#faad14",
  success: "#52c41a",
  processing: "#1677ff",
  error: "#ff4d4f",
  warning: "#faad14",
  default: "#8c8c8c",
};

const fallbackSolidPalette = [
  "#1677ff",
  "#52c41a",
  "#faad14",
  "#eb2f96",
  "#722ed1",
  "#13c2c2",
  "#fa541c",
  "#2f54eb",
  "#d4380d",
  "#08979c",
  "#389e0d",
  "#c41d7f",
];

/** Option value; booleans/numbers appear in legacy filter field configs. */
export type SelectV2Scalar = string | number | boolean;

export interface Option {
  value: SelectV2Scalar;
  label: string | React.ReactNode;
  disabled?: boolean;
  /** Plain text used for search when `label` is not a string. */
  searchLabel?: string;
  /** Hover hint (e.g. why a disabled option cannot be selected). */
  tooltip?: string;
}

const optionSearchText = (opt: Option) => {
  if (typeof opt.searchLabel === "string" && opt.searchLabel.trim() !== "") {
    return opt.searchLabel;
  }
  if (typeof opt.label === "string") {
    return opt.label;
  }
  return "";
};

export interface OptionGroup {
  label: string | React.ReactNode;
  options: Option[];
}

export interface SelectTagsProps {
  options?: Option[];
  optionGroups?: OptionGroup[];
  value?: string | string[] | null | undefined;
  onChange: (values: string | string[]) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  triggerHeight?: number | string;
  allowCustom?: boolean;
  maxTags?: number;
  /**
   * Max tags shown before "+N ...". Default: show all if ≤3, else 3 + overflow.
   * Pass `"responsive"` to use row-height measurement (legacy).
   */
  maxTagCount?: number | "responsive";
  maxRows?: number;
  searchable?: boolean;
  /**
   * Cap list height to roughly this many option rows; extra options scroll.
   * When omitted, the list uses `max-h-60` (~15rem).
   */
  maxVisibleOptions?: number;
  tagRender?: (props: {
    label: React.ReactNode;
    value: string;
    onClose: () => void;
    closable: boolean;
  }) => React.ReactNode;
  style?: React.CSSProperties;
  mode?: "multiple" | "tag" | "single";
  error?: boolean;
  disabled?: boolean;
  onBlur?: (e?: FocusEvent) => void;
  allowClear?: boolean;
  /**
   * Optionally pass the modal's DOM node to use as the portal container.
   * If omitted, the component auto-detects the nearest StyledModal via
   * the [data-modal-content] attribute.
   */
  portalContainer?: HTMLElement | null;
  /** Override dropdown z-index when portaling above high stacking contexts. */
  popoverZIndex?: number;
  testId?: string;
}

interface SelectTagItemProps {
  val: SelectV2Scalar;
  mode: "multiple" | "tag" | "single";
  flattenedOptions: Option[];
  tagRender?: SelectTagsProps["tagRender"];
  onRemove: (val: SelectV2Scalar) => void;
  resolveTagColor: (label: string) => string;
}

function SelectTagItem({
  val,
  mode,
  flattenedOptions,
  tagRender,
  onRemove,
  resolveTagColor,
}: SelectTagItemProps) {
  if (typeof val === "string" && val.startsWith("__all_")) return null;

  const option = flattenedOptions.find((opt) => opt.value === val);
  const label =
    option?.label ?? (typeof val === "string" ? val : String(val));
  const tagDisplayLabel =
    typeof label === "string"
      ? label
      : option
        ? optionSearchText(option) || String(val)
        : String(val);
  const onClose = () => onRemove(val);
  const rowKey = `sel-${String(val)}`;

  if (mode === "single") {
    return (
      <span
        key={rowKey}
        className="text-sm font-normal truncate text-foreground"
      >
        {label}
      </span>
    );
  }

  if (tagRender) {
    return (
      <span
        key={rowKey}
        data-tag-item
        onMouseDown={(e) => e.stopPropagation()}
      >
        {tagRender({
          label,
          value: String(val),
          closable: true,
          onClose,
        })}
      </span>
    );
  }

  const tagColor = resolveTagColor(tagDisplayLabel);

  return (
    <span
      key={rowKey}
      className="inline-flex max-w-50 shrink-0"
      data-tag-item
      onMouseDown={(e: MouseEvent) => e.preventDefault()}
    >
      <Tag
        color={tagColor}
        closable
        onClose={onClose}
        className="gap-1 truncate px-2 py-1 font-normal text-sm whitespace-nowrap max-w-62.5"
      >
        <span className="truncate">{tagDisplayLabel}</span>
      </Tag>
    </span>
  );
}

// Main Component
export function StyledSelect({
  options = [],
  optionGroups = [],
  value = [],
  onChange,
  placeholder = "Select...",
  className,
  triggerClassName,
  triggerHeight,
  allowCustom = true,
  maxTags,
  maxTagCount,
  maxRows = 2,
  mode = "single",
  disabled = false,
  searchable,
  maxVisibleOptions,
  tagRender,
  style,
  error,
  onBlur,
  allowClear,
  portalContainer,
  popoverZIndex,
}: SelectTagsProps) {
  const isSearchable = searchable ?? mode !== "single";
  const isHiddenOptionValue = (val: unknown) =>
    typeof val === "string" && val.startsWith("__all_");
  const hasOptionGroups = optionGroups.length > 0;

  const flattenedOptions = useMemo<Option[]>(() => {
    if (!hasOptionGroups) {
      return options;
    }

    return optionGroups.flatMap((group) => group.options);
  }, [hasOptionGroups, optionGroups, options]);

  const [open, setOpen] = useState(false);
  const [detectedModalContainer, setDetectedModalContainer] =
    useState<HTMLElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [singleModeContentWidth, setSingleModeContentWidth] = useState<
    number | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const singleModeContainerRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openRef = useRef(open);

  const overlayZIndexRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || popoverZIndex == null) {
        return;
      }

      node.style.setProperty("z-index", String(popoverZIndex), "important");
    },
    [popoverZIndex],
  );

  // Keep openRef in sync with open state so the blur timeout can read latest value
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Portal container resolution: auto-detect nearest StyledModal if no explicit container provided
  useEffect(() => {
    if (portalContainer !== undefined) return;

    if (!containerRef.current) {
      setDetectedModalContainer(null);
      return;
    }

    const modalNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-modal-content]"),
    );
    const match = modalNodes.find((el) => el.contains(containerRef.current));
    setDetectedModalContainer(match ?? null);
  }, [portalContainer, open]);

  const resolvedPortalContainer =
    portalContainer !== undefined ? portalContainer : detectedModalContainer;
  const isInsideModal = Boolean(resolvedPortalContainer);

  // Close page-level dropdowns when a modal opens so they don't stack above it.
  useEffect(() => {
    if (!open || isInsideModal) return;

    const closeIfDialogOpened = () => {
      if (document.querySelector('[role="dialog"][data-state="open"]')) {
        setOpen(false);
      }
    };

    closeIfDialogOpened();
    const observer = new MutationObserver(closeIfDialogOpened);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, [open, isInsideModal]);

  // Cleanup blur timeout on unmount
  useEffect(() => {
    return () => clearTimeout(blurTimeoutRef.current);
  }, []);

  const valueAsArray = useMemo<SelectV2Scalar[]>(() => {
    if (Array.isArray(value)) return value as SelectV2Scalar[];
    if (value === null || value === undefined || value === "") return [];
    return [value as SelectV2Scalar];
  }, [value]);

  const displayValueAsArray = useMemo(
    () => valueAsArray.filter((val) => !isHiddenOptionValue(val)),
    [valueAsArray],
  );

  const DEFAULT_MAX_VISIBLE = 3;

  // track responsive visible tags (only needed when maxTagCount === "responsive")
  const [responsiveVisibleTagCount, setResponsiveVisibleTagCount] =
    useState<number>(displayValueAsArray.length);

  const visibleTagCount = useMemo(() => {
    if (typeof maxTagCount === "number") {
      return Math.min(maxTagCount, displayValueAsArray.length);
    }
    if (maxTagCount !== "responsive") {
      return displayValueAsArray.length <= DEFAULT_MAX_VISIBLE
        ? displayValueAsArray.length
        : DEFAULT_MAX_VISIBLE;
    }
    return responsiveVisibleTagCount;
  }, [maxTagCount, displayValueAsArray.length, responsiveVisibleTagCount]);

  // Filter options
  const displayedOptions = useMemo(() => {
    let filtered = flattenedOptions;
    if (inputValue) {
      const q = inputValue.toLowerCase();
      filtered = flattenedOptions.filter((opt) =>
        optionSearchText(opt).toLowerCase().includes(q),
      );
    }

    if (mode === "tag" && allowCustom && inputValue && !hasOptionGroups) {
      const exactMatch = filtered.find((opt) => opt.value === inputValue);
      if (!exactMatch) {
        return [{ value: inputValue, label: inputValue }, ...filtered];
      }
    }

    return filtered;
  }, [flattenedOptions, inputValue, allowCustom, mode, hasOptionGroups]);

  const displayedOptionGroups = useMemo<OptionGroup[]>(() => {
    if (!hasOptionGroups) {
      return [];
    }

    return optionGroups
      .map((group) => {
        const optionsInGroup = inputValue
          ? group.options.filter((opt) =>
              optionSearchText(opt)
                .toLowerCase()
                .includes(inputValue.toLowerCase()),
            )
          : group.options;

        return {
          ...group,
          options: optionsInGroup,
        };
      })
      .filter((group) => group.options.length > 0);
  }, [hasOptionGroups, inputValue, optionGroups]);

  const displayedOptionIndexByValue = useMemo(() => {
    const indexByValue = new Map<SelectV2Scalar, number>();
    displayedOptions.forEach((option, index) => {
      indexByValue.set(option.value, index);
    });
    return indexByValue;
  }, [displayedOptions]);

  useLayoutEffect(() => {
    if (maxTagCount !== "responsive") return;
    if (!tagsContainerRef.current) return;

    const frameId = requestAnimationFrame(() => {
      if (!tagsContainerRef.current) return;
      const tags =
        tagsContainerRef.current.querySelectorAll("[data-tag-item]");
      if (tags.length === 0) {
        setResponsiveVisibleTagCount(displayValueAsArray.length);
        return;
      }

      const firstTagTop = (tags[0] as HTMLElement).offsetTop;
      const maxBottom = firstTagTop + maxRows * 32;

      let count = 0;
      tags.forEach((tag) => {
        const tagBottom =
          (tag as HTMLElement).offsetTop + (tag as HTMLElement).offsetHeight;
        if (tagBottom <= maxBottom) {
          count++;
        }
      });

      const hiddenCount = displayValueAsArray.length - count;
      if (hiddenCount > 0 && count > 0) {
        setResponsiveVisibleTagCount(count - 1);
      } else {
        setResponsiveVisibleTagCount(count);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [displayValueAsArray, maxRows, maxTagCount]);

  if (mode === "single" && !isSearchable) {
    const singleValue: SelectV2Scalar | undefined = Array.isArray(value)
      ? (value[0] as SelectV2Scalar | undefined)
      : ((value ?? undefined) as SelectV2Scalar | undefined);
    const radixSelectValue =
      singleValue === undefined || singleValue === null || singleValue === ""
        ? ""
        : String(singleValue);

    return (
      <div className={className} ref={singleModeContainerRef}>
        <Select
          disabled={disabled}
          value={radixSelectValue}
          onValueChange={(val) => {
            const match = flattenedOptions.find((o) => String(o.value) === val);
            onChange((match ? match.value : val) as string);
            onBlur?.();
          }}
          onOpenChange={(open) => {
            if (open) {
              const width =
                singleModeContainerRef.current?.getBoundingClientRect().width;
              if (width) setSingleModeContentWidth(Math.round(width));
            }
            if (!open) onBlur?.();
          }}
        >
          <SelectTrigger
            disabled={disabled}
            className={cn(error && "border-red-500")}
            triggerClassName={triggerClassName}
            triggerHeight={triggerHeight}
            onBlur={onBlur}
            style={style}
            error={error}
            showClear={
              allowClear && singleValue !== undefined && singleValue !== ""
            }
            onClear={() => {
              onChange("");
              onBlur?.();
            }}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "max-h-60 w-(--radix-select-trigger-width) min-w-(--radix-select-trigger-width) max-w-(--radix-select-trigger-width)",
              maxVisibleOptions != null &&
                `max-h-[min(45vh,calc(${maxVisibleOptions}*2.35rem))]`,
            )}
            style={
              singleModeContentWidth
                ? {
                    width: singleModeContentWidth,
                    minWidth: singleModeContentWidth,
                    maxWidth: singleModeContentWidth,
                  }
                : undefined
            }
          >
            {flattenedOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No Data
              </div>
            ) : (
              <>
                {hasOptionGroups
                  ? optionGroups.map((group, groupIndex) => (
                      <SelectGroup key={`group-${groupIndex}`}>
                        <SelectLabel>{group.label}</SelectLabel>
                        {group.options.map((option, optionIndex) => (
                          <SelectItem
                            disabled={disabled || option.disabled}
                            key={`${option.value}-${groupIndex}-${optionIndex}`}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))
                  : options.map((option, index) => (
                      <SelectItem
                        disabled={disabled || option.disabled}
                        key={`${option.value}-${index}`}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Handle focus
  const handleFocus = () => {
    clearTimeout(blurTimeoutRef.current);
    setOpen(true);
  };

  // Handle adding a value
  const handleSelect = (val: SelectV2Scalar) => {
    clearTimeout(blurTimeoutRef.current);
    const selectedOption = displayedOptions.find(
      (option) => option.value === val,
    );
    if (disabled || selectedOption?.disabled) {
      return;
    }

    if (mode === "single") {
      onChange(val as string);
      setOpen(false);
      setInputValue("");
      return;
    }

    if (valueAsArray.includes(val)) {
      handleRemove(val);
      inputRef.current?.focus();
      return;
    }

    if (maxTags && valueAsArray.length >= maxTags) return;

    onChange([...valueAsArray, val] as string[]);
    setInputValue("");
    setOpen(true);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Handle removal
  const handleRemove = (val: SelectV2Scalar) => {
    if (mode === "single") {
      onChange("");
      return;
    }
    onChange(valueAsArray.filter((item) => item !== val) as string[]);
    inputRef.current?.focus();
  };

  // Handle clear all
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(mode === "single" ? "" : []);
    inputRef.current?.focus();
  };

  // Handle blur — deferred so that clicking a dropdown item fires handleSelect first
  const handleBlur = (e?: FocusEvent) => {
    blurTimeoutRef.current = setTimeout(() => {
      if (openRef.current) return;

      if (mode === "tag" && allowCustom && inputValue) {
        if (!valueAsArray.includes(inputValue)) {
          if (!(maxTags && valueAsArray.length >= maxTags)) {
            onChange([...valueAsArray, inputValue] as string[]);
          }
        }
        setInputValue("");
      }

      if (mode === "multiple") setInputValue("");
      onBlur?.(e);
    }, 150);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      !inputValue &&
      valueAsArray.length > 0 &&
      mode !== "single"
    ) {
      handleRemove(valueAsArray[valueAsArray.length - 1]);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (open && activeIndex >= 0 && activeIndex < displayedOptions.length) {
        handleSelect(displayedOptions[activeIndex].value);
        return;
      }

      if (mode === "tag" && inputValue && allowCustom) {
        if (displayedOptions.length > 0) {
          if (!valueAsArray.includes(inputValue)) {
            if (maxTags && valueAsArray.length >= maxTags) return;
            onChange([...valueAsArray, inputValue] as string[]);
          }
          setInputValue("");
          setActiveIndex(-1);
          return;
        }
      }

      if (mode === "multiple") {
        setActiveIndex(-1);
        return;
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const tagsToRender = displayValueAsArray.slice(0, visibleTagCount);
  const hiddenCount = displayValueAsArray.length - visibleTagCount;
  const showPlaceholder = displayValueAsArray.length === 0 && !inputValue;

  const resolveTagColor = (label: string) => {
    const computed = getColorFromString(label);
    if (
      computed &&
      computed.startsWith("#") &&
      computed.toLowerCase() !== "#fafafa"
    ) {
      return computed;
    }
    if (solidTagColorMap[computed]) {
      return solidTagColorMap[computed];
    }
    return getColorFromString(label, fallbackSolidPalette);
  };

  // portalTarget:
  //   - Inside StyledModal → the [data-modal-content] DialogContent node.
  //     The dropdown renders as a DOM child of the modal, so it inherits the
  //     modal's stacking context and always appears above the backdrop.
  //   - Everywhere else   → document.body (normal Radix behaviour).
  const portalTarget =
    resolvedPortalContainer ??
    (typeof document !== "undefined" ? document.body : undefined);
  const defaultPopoverZIndex = isInsideModal ? 100010 : 1000;

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setActiveIndex(-1);
        }
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          "group relative flex items-center p-1 border rounded-xl bg-background min-h-6 cursor-text ring-offset-background transition-colors hover:border-primary/50 focus-within:ring-2 focus-within:border-primary",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        style={style}
        onMouseDown={(e) => {
          if (disabled) return;
          e.preventDefault();
          clearTimeout(blurTimeoutRef.current);
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* Tags and input */}
        <div
          ref={tagsContainerRef}
          className={cn(
            "flex items-center gap-1 flex-wrap flex-1 min-w-0 pr-6",
            mode === "single" && "grid grid-cols-1",
          )}
        >
          {mode === "single" ? (
            <>
              {!inputValue && displayValueAsArray.length > 0 && (
                <div className="col-start-1 row-start-1 flex items-center min-w-0 truncate text-sm pointer-events-none">
                  <SelectTagItem
                    val={displayValueAsArray[0]}
                    mode={mode}
                    flattenedOptions={flattenedOptions}
                    tagRender={tagRender}
                    onRemove={handleRemove}
                    resolveTagColor={resolveTagColor}
                  />
                </div>
              )}
              <input
                ref={inputRef}
                readOnly={!isSearchable}
                className={cn(
                  "col-start-1 row-start-1 w-full bg-transparent px-1 outline-none text-sm",
                  !isSearchable && "cursor-default caret-transparent",
                )}
                value={inputValue}
                onChange={(e) => {
                  if (!isSearchable) return;
                  setInputValue(e.target.value);
                  setOpen(true);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={showPlaceholder ? placeholder : ""}
              />
            </>
          ) : (
            <>
              {tagsToRender.map((val) => (
                <SelectTagItem
                  key={`sel-${String(val)}`}
                  val={val}
                  mode={mode}
                  flattenedOptions={flattenedOptions}
                  tagRender={tagRender}
                  onRemove={handleRemove}
                  resolveTagColor={resolveTagColor}
                />
              ))}
              {hiddenCount > 0 && (
                <div
                  style={{
                    backgroundColor:
                      displayValueAsArray.length > 0
                        ? resolveTagColor(
                            String(
                              displayValueAsArray[
                                displayValueAsArray.length - 1
                              ],
                            ),
                          )
                        : undefined,
                  }}
                  className="px-1.5 text-white rounded-md font-normal text-sm whitespace-nowrap shrink-0"
                  data-tag-item
                >
                  + {hiddenCount} ...
                </div>
              )}
              <input
                ref={inputRef}
                readOnly={!isSearchable}
                className={cn(
                  "px-1 outline-none text-sm placeholder:text-muted-foreground bg-transparent",
                  !isSearchable && "cursor-default caret-transparent",
                )}
                style={{
                  minWidth: 10,
                  width: inputValue
                    ? `${Math.max(4, inputValue.length + 3)}ch`
                    : showPlaceholder
                      ? "100%"
                      : "10px",
                }}
                value={inputValue}
                onChange={(e) => {
                  if (!isSearchable) return;
                  setInputValue(e.target.value);
                  setOpen(true);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={showPlaceholder ? placeholder : ""}
              />
            </>
          )}
        </div>

        {/* Arrow / Clear */}
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0 text-muted-foreground mr-1">
          {allowClear && valueAsArray.length > 0 ? (
            <>
              <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-0 transition-opacity" />
              <XCircle
                data-select-clear
                className="absolute h-4 w-4 fill-muted-foreground/20 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
              />
            </>
          ) : (
            <ChevronDown className="h-4 w-4 opacity-50" />
          )}
        </div>
      </div>

      <PopoverPortal container={portalTarget}>
        <PopoverPositioner
          anchor={containerRef}
          side="bottom"
          sideOffset={4}
          align="start"
        >
          <PopoverPopup
            ref={overlayZIndexRef}
            className={cn(
              "p-0 w-(--anchor-width) min-w-50 flex flex-col overflow-hidden max-h-[min(50vh,calc(100vh-4rem))]",
            )}
            style={
              popoverZIndex == null
                ? { zIndex: defaultPopoverZIndex }
                : { zIndex: popoverZIndex }
            }
            initialFocus={false}
          >
            <TooltipProvider delay={300}>
              {mode === "single" && isSearchable && (
                <div className="p-2 border-b">
                  <input
                    autoFocus
                    className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    placeholder="Search..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
              <div
                className={cn(
                  "overflow-y-auto overflow-x-hidden p-1",
                  maxVisibleOptions == null && "max-h-60",
                  displayedOptions.length === 0 &&
                    "h-25 flex items-center justify-center p-0",
                )}
                style={{
                  pointerEvents: "auto",
                  ...(maxVisibleOptions != null
                    ? {
                        maxHeight: `min(45vh, calc(${maxVisibleOptions} * 2.35rem))`,
                      }
                    : {}),
                }}
                onMouseDown={(e) => e.preventDefault()}
                onWheel={(e) => e.stopPropagation()}
              >
                {displayedOptions.length === 0 ? (
                  <div className="py-2 text-center text-sm text-muted-foreground">
                    No data
                  </div>
                ) : hasOptionGroups ? (
                  displayedOptionGroups.map((group, groupIndex) => (
                    <div key={`display-group-${groupIndex}`} className="py-1">
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {group.label}
                      </div>
                      {group.options.map((option, optionIndex) => {
                        const index =
                          displayedOptionIndexByValue.get(option.value) ?? -1;
                        const isSelected = valueAsArray.includes(option.value);
                        const isOptionDisabled = disabled || option.disabled;

                        const labelSlot = (
                          <>
                            <span className="flex-1 truncate">
                              {option.label}
                            </span>
                            {isSelected && (
                              <Check className="ml-2 size-4 shrink-0 opacity-100 text-primary-100" />
                            )}
                          </>
                        );

                        return (
                          <div
                            key={`${option.value}-${groupIndex}-${optionIndex}`}
                            className={cn(
                              "relative flex select-none items-center px-2 py-1.5 text-sm outline-none transition-colors",
                              isOptionDisabled
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-default",
                              !isOptionDisabled && index === activeIndex
                                ? "bg-gray-200 text-accent-foreground"
                                : !isOptionDisabled && "hover:bg-accent/50",
                              isSelected ? "bg-primary-50" : "",
                            )}
                            onClick={() => {
                              if (isOptionDisabled) return;
                              handleSelect(option.value);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseEnter={() => {
                              if (isOptionDisabled) return;
                              setActiveIndex(index);
                            }}
                          >
                            {option.tooltip ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="flex min-w-0 flex-1 items-center gap-1">
                                    {labelSlot}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  className="max-w-65 text-xs"
                                >
                                  {option.tooltip}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              labelSlot
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  displayedOptions.map((option, index) => {
                    const isSelected = valueAsArray.includes(option.value);
                    const isOptionDisabled = disabled || option.disabled;
                    const labelSlot = (
                      <>
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && (
                          <Check className="ml-2 size-4 shrink-0 opacity-100 text-primary-100" />
                        )}
                      </>
                    );

                    return (
                      <div
                        key={`${option.value}-${index}`}
                        className={cn(
                          "relative flex select-none items-center px-2 py-1.5 text-sm outline-none transition-colors",
                          isOptionDisabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-default",
                          !isOptionDisabled && index === activeIndex
                            ? "bg-gray-200 text-accent-foreground"
                            : !isOptionDisabled && "hover:bg-accent/50",
                          isSelected ? "bg-primary-50" : "",
                        )}
                        onClick={() => {
                          if (isOptionDisabled) return;
                          handleSelect(option.value);
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => {
                          if (isOptionDisabled) return;
                          setActiveIndex(index);
                        }}
                      >
                        {option.tooltip ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex min-w-0 flex-1 items-center gap-1">
                                {labelSlot}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="left"
                              className="max-w-65 text-xs"
                            >
                              {option.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          labelSlot
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </TooltipProvider>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}
