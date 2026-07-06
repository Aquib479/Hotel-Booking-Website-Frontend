import { useCallback, useMemo, useState } from "react";

type Validator<T extends Record<string, unknown>> = (
  field: keyof T,
  values: T
) => string | undefined;

export function useAuthForm<T extends Record<string, unknown>>(
  initialValues: T,
  validateField: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
        }
        return next;
      });
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((t) => ({ ...t, [field]: true }));
      setValues((prev) => {
        setErrors((e) => ({ ...e, [field]: validateField(field, prev) }));
        return prev;
      });
    },
    [validateField]
  );

  const validateAll = useCallback(() => {
    const nextErrors: Partial<Record<keyof T, string>> = {};
    (Object.keys(values) as (keyof T)[]).forEach((key) => {
      const error = validateField(key, values);
      if (error) nextErrors[key] = error;
    });
    setErrors(nextErrors);
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      )
    );
    return Object.keys(nextErrors).length === 0;
  }, [values, validateField]);

  const isValid = useMemo(() => {
    return (Object.keys(values) as (keyof T)[]).every(
      (key) => !validateField(key, values)
    );
  }, [values, validateField]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  };
}
