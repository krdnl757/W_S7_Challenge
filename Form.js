import axios from "axios";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: "full name must be at least 3 characters",
  fullNameTooLong: "full name must be at most 20 characters",
  sizeIncorrect: "size must be S or M or L",
};

// 👇 Here you will create your schema.
const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required("Full name is required"),
  size: yup
    .string()
    .oneOf(["S", "M", "L"], validationErrors.sizeIncorrect)
    .required("Size is required"),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: "1", text: "Pepperoni" },
  { topping_id: "2", text: "Green Peppers" },
  { topping_id: "3", text: "Pineapple" },
  { topping_id: "4", text: "Mushrooms" },
  { topping_id: "5", text: "Ham" },
];

const initialFormValues = {
  fullName: "",
  size: "",
  toppings: [],
};

const initialErrors = {
  fullName: "",
  size: "",
};

export default function Form() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState('');

  const checkValidation = async () => {
    try {
      const valid = await validationSchema.isValid(formValues);
      setIsDisabled(!valid);
    } catch (error) {
      setErrors({ ...errors, [error.path]: error.errors[0] });
    }
  };

  useEffect(() => {
    checkValidation();
  }, [formValues]);

  const handleTextChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });

    yup
      .reach(validationSchema, id)
      .validate(value.trim())
      .then(() => setErrors({...errors, [id]: ''}))
      .catch((error) => setErrors({...errors, [id]: error.errors[0]}));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormValues({
        ...formValues,
        toppings: [...formValues.toppings, name],
      });
    } else {
      setFormValues({
        ...formValues,
        toppings: formValues.toppings.filter((t) => t !== name),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post('http://localhost:9009/api/order', formValues);
    setMessage(data.message);
    setFormValues(initialFormValues)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {message && <div className="success">{message}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            onChange={handleTextChange}
            value={formValues.fullName}
            placeholder="Type full name"
            id="fullName"
            type="text"
          />
        </div>
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select value={formValues.size} id="size" onChange={handleTextChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              onChange={handleCheckboxChange}
              checked={formValues.toppings.includes(topping.topping_id)}
              name={topping.topping_id}
              type="checkbox"
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={isDisabled} type="submit" />
    </form>
  );
}