import React from "react";
import { useFormContext } from "react-hook-form";
import InputField from "../../../common/InputField";

type FormValues = {
  email: string;
  password: string;
  role: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
};

const UserAccountCreationForm: React.FC<Props> = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message as String}
          </p>
        )}
      </div>

      <div>
        <input
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">
            {errors.password.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1">Role</label>
        <select
          {...register("role", {
            required: "Role is required",
          })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">HR</option>
          <option value="user">Employee</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm">
            {errors.role.message as String}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserAccountCreationForm;
