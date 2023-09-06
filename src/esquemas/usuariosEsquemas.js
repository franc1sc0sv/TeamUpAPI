import { z } from "zod";

const esDominioEspecifico = (email) => {
  if (!process.env.EMAIL_DOMAIN_RESTRICT) return true;

  return email.endsWith(`@${process.env.EMAIL_DOMAIN}`);
};

const usuarioEsquema = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
  apellido: z.string().optional(), 
  email: z
    .string({ required_error: "email_requerido" })
    .email({ message: "email_invalido" })
    .refine((email) => esDominioEspecifico(email), {
      message: "email_dominio_especifico",
    }),
  password: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" }),
  id_nivelAcademico: z
    .string({ required_error: "nivel_academico_requerido" })
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "nivel_academico_requerido" })),
});

export const verificarCorreoToken = z.object({
  token: z
    .string({ required_error: "token_requerido" })
    .nonempty("token_vacio"),
});

const emailEsquema = z.object({
  email: z
    .string({ required_error: "email_requerido" })
    .email({ message: "email_invalido" })
    .refine((email) => esDominioEspecifico(email), {
      message: "email_dominio_especifico",
    }),
});

const changePasswordEsquema = z.object({
  token: z.string({ required_error: "token_invalido " }),
  password: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" }),
  confirm_password: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" }),
});

const usuarioLogeoEsquema = z.object({
  email: z
    .string({ required_error: "email_requerido" })
    .email({ message: "email_invalido" })
    .refine((email) => esDominioEspecifico(email), {
      message: "email_dominio_especifico",
    }),
  password: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" }),
});

const usuarioEsquemaActualizar = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio")
    .optional(),
  password: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" })
    .optional(),
  id_nivelAcademico: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export {
  changePasswordEsquema,
  usuarioEsquema,
  usuarioEsquemaActualizar,
  usuarioLogeoEsquema,
  emailEsquema,
};
