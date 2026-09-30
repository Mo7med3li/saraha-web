// import * as React from "react";
// import { CheckIcon, ChevronsUpDown } from "lucide-react";
// import * as RPNInput from "react-phone-number-input";
// import flags from "react-phone-number-input/flags";

// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "./command";
// import { Popover, PopoverContent, PopoverTrigger } from "./popover";
// import { ScrollArea } from "./scroll-area";
// import { Button } from "./button";
// import { cn } from "cn";
// import { Input } from "./input";

// type PhoneInputProps = Omit<
//   React.ComponentProps<"input">,
//   "onChange" | "value" | "ref"
// > &
//   Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
//     onChange?: (value: RPNInput.Value) => void;
//   } &{error : boolean};

// const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
//   React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
//     ({ className, onChange, value ,error, ...props }, ref) => {
//       return (
//         <RPNInput.default
//           ref={ref}
//           error={error}
//           className={cn("flex", className)}
//           flagComponent={FlagComponent}
//           countrySelectComponent={CountrySelect}
//           inputComponent={InputComponent}
//           smartCaret={false}
//           value={value || undefined}
//           onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
//           {...props}
//         />
//       );
//     },
//   );
// PhoneInput.displayName = "PhoneInput";

// const InputComponent = React.forwardRef<
//   HTMLInputElement,
//   React.ComponentProps<"input">
// >(({ className, ...props }, ref) => {
//   return (
//     <Input
//       error={error}
//       className={cn("rounded-e-lg rounded-s-none h-10 px-3", className)}
//       {...props}
//       ref={ref}
//     />
//   );
// });
// InputComponent.displayName = "InputComponent";

// type CountryEntry = { label: string; value: RPNInput.Country | undefined };

// type CountrySelectProps = {
//   disabled?: boolean;
//   value: RPNInput.Country;
//   options: CountryEntry[];
//   onChange: (country: RPNInput.Country) => void;
// };

// const CountrySelect = ({
//   disabled,
//   value: selectedCountry,
//   options: countryList,
//   onChange,
// }: CountrySelectProps) => {
//   const scrollAreaRef = React.useRef<HTMLDivElement>(null);
//   const [searchValue, setSearchValue] = React.useState("");
//   const [isOpen, setIsOpen] = React.useState(false);

//   return (
//     <Popover open={isOpen} onOpenChange={setIsOpen} modal>
//       <PopoverTrigger>
//         <Button
//           type="button"
//           //   variant="outline"
//           className="flex gap-1 bg-[oklch(0.72_0.1_175/0.25)] hover:bg-green-600 rounded-e-none rounded-s-lg border-r-0 border-zinc-300 px-3 h-10 focus:z-10"
//           disabled={disabled}
//         >
//           <FlagComponent
//             country={selectedCountry}
//             countryName={selectedCountry}
//           />
//           <span className="text-gray-950 text-sm font-medium">
//             <span>{selectedCountry}</span>(
//             <span>
//               +
//               {selectedCountry
//                 ? RPNInput.getCountryCallingCode(selectedCountry)
//                 : ""}
//             </span>
//             )
//           </span>
//           <ChevronsUpDown
//             className={cn(
//               "-mr-2 size-4 opacity-50 text-black",
//               disabled ? "hidden" : "opacity-100",
//             )}
//           />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-75 p-0">
//         <Command>
//           <CommandInput
//             value={searchValue}
//             onValueChange={(value) => {
//               setSearchValue(value);
//               setTimeout(() => {
//                 if (scrollAreaRef.current) {
//                   const viewportElement = scrollAreaRef.current.querySelector(
//                     "[data-radix-scroll-area-viewport]",
//                   );
//                   if (viewportElement) {
//                     viewportElement.scrollTop = 0;
//                   }
//                 }
//               }, 0);
//             }}
//             placeholder="Search country..."
//           />
//           <CommandList>
//             <ScrollArea ref={scrollAreaRef} className="h-72">
//               <CommandEmpty>No country found.</CommandEmpty>
//               <CommandGroup>
//                 {countryList.map(({ value, label }) =>
//                   value ? (
//                     <CountrySelectOption
//                       key={value}
//                       country={value}
//                       countryName={label}
//                       selectedCountry={selectedCountry}
//                       onChange={onChange}
//                       onSelectComplete={() => setIsOpen(false)}
//                     />
//                   ) : null,
//                 )}
//               </CommandGroup>
//             </ScrollArea>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

// interface CountrySelectOptionProps extends RPNInput.FlagProps {
//   selectedCountry: RPNInput.Country;
//   onChange: (country: RPNInput.Country) => void;
//   onSelectComplete: () => void;
// }

// const CountrySelectOption = ({
//   country,
//   countryName,
//   selectedCountry,
//   onChange,
//   onSelectComplete,
// }: CountrySelectOptionProps) => {
//   const handleSelect = () => {
//     onChange(country);
//     onSelectComplete();
//   };

//   return (
//     <CommandItem className="gap-2" onSelect={handleSelect}>
//       <FlagComponent country={country} countryName={countryName} />
//       <span className="flex-1 text-sm">{countryName}</span>
//       <span className="flex gap-1 text-sm text-black">
//         <span className="font-medium">{country}</span>
//         <span>+{RPNInput.getCountryCallingCode(country)}</span>
//       </span>
//       <CheckIcon
//         className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
//       />
//     </CommandItem>
//   );
// };

// const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
//   const Flag = flags[country];

//   return (
//     <span className="flex h-4 w-4 overflow-hidden rounded-full bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
//       {Flag && <Flag title={countryName} />}
//     </span>
//   );
// };

// export { PhoneInput };
import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { cn } from "cn";
import { Input } from "./input";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    error?: boolean;
    ref?: React.Ref<React.ElementRef<typeof RPNInput.default>>;
  };

// Carries `error` down to InputComponent, which RPNInput.default
// won't forward on its own since it isn't a prop it knows about.
const PhoneInputErrorContext = React.createContext(false);

function PhoneInput({
  className,
  onChange,
  value,
  error = false,
  ref,
  ...props
}: PhoneInputProps) {
  return (
    <PhoneInputErrorContext value={error}>
      <RPNInput.default
        ref={ref}
        className={cn("flex", className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
        {...props}
      />
    </PhoneInputErrorContext>
  );
}

function InputComponent({
  className,
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  const error = React.useContext(PhoneInputErrorContext);
  return (
    <Input
      error={error}
      className={cn("rounded-e-lg rounded-s-none h-10 px-3", className)}
      {...props}
      ref={ref}
    />
  );
}

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger
        render={
          <Button
            type="button"
            className="flex gap-1 bg-muted/60 hover:bg-muted rounded-e-none rounded-s-lg border-r-0 border-input px-3 h-10 focus:z-10 cursor-pointer"
            disabled={disabled}
          >
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
            <span className="text-foreground text-sm font-medium">
              <span>{selectedCountry}</span>(
              <span>
                +
                {selectedCountry
                  ? RPNInput.getCountryCallingCode(selectedCountry)
                  : ""}
              </span>
              )
            </span>
            <ChevronsUpDown
              className={cn(
                "-mr-1.5 size-4 opacity-60 text-muted-foreground",
                disabled ? "hidden" : "opacity-100",
              )}
            />
          </Button>
        }
      />
      <PopoverContent className="w-75 p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]",
                  );
                  if (viewportElement) {
                    viewportElement.scrollTop = 0;
                  }
                }
              }, 0);
            }}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="flex gap-1 text-sm text-black">
        <span className="font-medium">{country}</span>
        <span>+{RPNInput.getCountryCallingCode(country)}</span>
      </span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-4 overflow-hidden rounded-full bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
