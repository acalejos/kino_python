import React, { useEffect, useState } from "react";
import classNames from "classnames";

export default function App({ ctx, payload }) {
  const [fields, setFields] = useState(payload.fields);

  useEffect(() => {
    ctx.handleEvent("update", ({ fields }) => {
      setFields((currentFields) => ({ ...currentFields, ...fields }));
    });
  }, []);

  function pushUpdate(field, value) {
    console.log(field);
    console.log(value);
    ctx.pushEvent("update_field", { field, value });
  }

  function handleChange(event, push = true) {
    const field = event.target.name;

    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setFields({ ...fields, [field]: value });

    if (push) {
      pushUpdate(field, value);
    }
  }

  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="rounded-lg border border-gray-300 bg-[#fefefe]">
        <Header>
          <div className="flex items-center justify-between gap-3">
            <img className="h-6" src="logo.svg" alt="Logo" />

            <FieldWrapper>
              <InlineLabel label="Return" />
              <TextField
                name="return_values"
                value={fields.return_values}
                onChange={handleChange}
              />
            </FieldWrapper>
          </div>
        </Header>
      </div>
    </div>
  );
}

function Header({ children }) {
  return (
    <div className="align-stretch flex flex-wrap justify-start gap-4 rounded-t-lg border-b border-b-gray-200 bg-blue-100 px-4 py-2">
      {children}
    </div>
  );
}

function FieldWrapper({ children }) {
  return <div className="flex items-center gap-1.5">{children}</div>;
}

function InlineLabel({ label }) {
  return (
    <label className="block text-sm font-medium uppercase text-gray-600">
      {label}
    </label>
  );
}

function TextField({
  label = null,
  value,
  type = "text",
  className,
  required = false,
  fullWidth = false,
  inputRef,
  startAdornment,
  ...props
}) {
  return (
    <div
      className={classNames([
        "flex max-w-full flex-col",
        fullWidth ? "w-full" : "w-[20ch]",
      ])}
    >
      {label && (
        <label className="color-gray-800 mb-0.5 block text-sm font-medium">
          {label}
        </label>
      )}
      <div
        className={classNames([
          "flex items-stretch overflow-hidden rounded-lg border bg-gray-50",
          required && !value ? "border-red-300" : "border-gray-200",
        ])}
      >
        {startAdornment}
        <input
          {...props}
          ref={inputRef}
          type={type}
          value={value}
          className={classNames([
            "w-full bg-transparent px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none",
            className,
          ])}
        />
      </div>
    </div>
  );
}
