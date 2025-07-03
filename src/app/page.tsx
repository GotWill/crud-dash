"use client";

import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
  Link,
  addToast
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/app/lib/api";
import { useRouter } from 'next/navigation'
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { span } from "framer-motion/client";

export default function CriarConta() {

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const country = [
    { key: "BR", label: "Brasil", code: "+55" },
    { key: "US", label: "Estados Unidos", code: "+1" },
    { key: "AR", label: "Argentina", code: "+54" },
    { key: "PT", label: "Portugal", code: "+351" },
  ];


  const schemaForm = z.object({
    name: z.string().min(1, { message: 'Obrigatorio' }),
    email: z.string().email(),
    password: z.string().min(1, { message: 'Obrigatorio' }),
    verifyPassword: z.string().min(1, { message: 'Obrigatorio' }),
    phone: z.object({
      country: z.string(),
      ddd: z.string(),
      number: z.string()
    })
  }).refine(({ password, verifyPassword }) => password === verifyPassword, {
    message: 'As senhas precisam ser iguais',
    path: ['verifyPassword']
  });

  type schemaForm = z.infer<typeof schemaForm>

  const { register, handleSubmit, watch, reset, control, setValue, formState: { errors, isSubmitting } } = useForm<schemaForm>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      verifyPassword: '',
      phone: {
        country: '',
        ddd: '',
        number: ''
      }
    }
  })

  const router = useRouter()


  const sendForm = async (values: schemaForm) => {
    try {
      const response = await api.post('/users', values)

      if (response.data.token) {
        setCookie('token', response.data.token, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        addToast({
          title: "Tudo pronto! Sua conta foi criada com sucesso.",
          color: 'success',
        })

        reset({
          email: '',
          name: '',
          password: '',
          verifyPassword: '',
          phone: {
            country: '',
            ddd: '',
            number: ''
          }
        })

        router.push('/dashboard')
      }

    } catch (error) {
      const axiosError = error as AxiosError<{ codeIntern: string; message: string }>;

      if (axiosError.response?.data?.codeIntern === 'USR_0004') {
        addToast({
          title: "Já existe um usuário com esse email",
          color: 'danger',
        })
      }
    }
  };



  const selectedCountry = watch('phone.country');

  useEffect(() => {
    const selected = country.find(country => country.key === selectedCountry);
    if (selected) {
      setValue('phone.ddd', selected.code);
    }
  }, [selectedCountry]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-600 text-sm">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(sendForm)} className="space-y-6">
            <Input
              label="Nome completo"
              placeholder="Digite seu nome completo"
              variant="bordered"
              isRequired
              className="w-full"
              {...register('name')}
            />

            <Input
              label="Email"
              placeholder="seu@email.com"
              type="email"
              variant="bordered"
              isRequired
              className="w-full"
              {...register('email')}
            />

            <div className="mb-4">
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                variant="bordered"
                {...register('password')}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOff className="text-2xl text-default-400 pointer-events-none" size={20} />
                    ) : (
                      <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                required
                className={`w-full ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-4">
              <Input
                label="Confirmar senha"
                placeholder="Confirme sua senha"
                variant="bordered"
                {...register('verifyPassword')}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmVisibility}
                  >
                    {isConfirmVisible ? (
                      <EyeOff className="text-2xl text-default-400 pointer-events-none" size={20} />
                    ) : (
                      <Eye className="text-2xl text-default-400 pointer-events-none" size={20} />
                    )}
                  </button>
                }
                type={isConfirmVisible ? "text" : "password"}
                required
                className={`w-full ${errors.verifyPassword ? 'border-red-500' : ''}`}
              />
              {errors.verifyPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.verifyPassword.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Telefone
              </label>
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name="phone.country"
                  rules={{ required: 'Obrigatório' }}
                  render={({ field }) => (
                    <Select
                      label="País"
                      placeholder="Selecione o país"
                      variant="bordered"
                      className="w-24"
                      selectedKeys={[field.value]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        field.onChange(selected); // atualiza o país

                        const paisSelecionado = country.find(p => p.key === selected);
                        if (paisSelecionado) {
                          setValue('phone.ddd', paisSelecionado.code); // atualiza o DDD com o código do país
                        }
                      }}
                      isRequired
                    >
                      {country.map((pais) => (
                        <SelectItem key={pais.key}>{pais.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />



                <Input
                  placeholder="DDD"
                  variant="bordered"
                  className="w-20"
                  maxLength={3}
                  isRequired
                  {...register('phone.ddd')}
                />

                <Input
                  placeholder="Número"
                  variant="bordered"
                  className="flex-1"
                  isRequired
                  {...register('phone.number')}
                />
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full bg-black hover:bg-gray-800"
            >

              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  <span>Aguarde...</span>
                </>
              ) : (
                <span>Criar Conta</span>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Fazer login
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}