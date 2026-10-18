import { isEmail } from "@/lib/utils";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const userFormSchema = toTypedSchema(
    z.object({
        full_name: z.string().nonempty({ message: "Không được bỏ trống Tên" }),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .min(1, "Không được bỏ trống Email")
            .refine(
                (val) => val === "" || isEmail(val),
                { message: "Email không đúng định dạng" }
            ),
        phone: z.string().nonempty({ message: "Không được bỏ trống điện thoại" }),
        role: z.string().nonempty({ message: "Không được bỏ trống role" }),
        lang: z.string().nonempty({ message: "Không được bỏ trống Ngôn ngữ" }),
    })
);