'use client'
import { api } from "@/app/lib/api";
import { Product } from "@/app/types";
import { ModalContent, Input, ModalBody, ModalHeader, Textarea, Button, Modal, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ModalFormProps {
    isOpen: boolean;
    onOpenChange: () => void
    product?: Product
}

export default function ModalForm({ isOpen, product, onOpenChange }: ModalFormProps) {
    const schemaForm = z.object({
        title: z.string().min(1, { message: 'campo obrigatório' }),
        description: z.string().min(1, { message: 'campo obrigatório' }),
        thumbnail: product
            ? z.any().optional()
            : z.custom<FileList>()
                .refine((file) => file && file.length === 1, {
                    message: "Imagem obrigatória"
                }),
    });

    type schemaForm = z.infer<typeof schemaForm>

    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<schemaForm>({
        resolver: zodResolver(schemaForm),
        defaultValues: {
            title: product?.title ?? '',
            description: product?.description ?? '',
        }
    })

    const router = useRouter();

    async function sendForm(values: schemaForm) {
        const token = getCookie("token");


        if (product) {
            try {
                await api.put(`/products/${product.id}`, {
                    title: values.title,
                    description: values.description,
                });

                addToast({
                    title: "Produto atualizado",
                    color: "success",
                });
            } catch (error) {
                addToast({
                    title: "Erro ao atualizar produto",
                    color: "danger",
                });
            }
        } else {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("thumbnail", values.thumbnail[0]);

            try {
                await api.post("/products", formData);

                addToast({
                    title: "Produto criado",
                    color: "success",
                });

                reset({ title: "", description: "" });
            } catch (error) {
                addToast({
                    title: "Erro ao criar produto",
                    color: "danger",
                });
            }
        }
        onOpenChange();
        router.refresh();

    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            placement="center"
            backdrop="blur"
        >
            <ModalContent>
                {(_) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold dark:text-white">{product ? `Editando produto: ${product.title}` : 'Criar Novo Produto'}</h2>
                            </div>
                        </ModalHeader>
                        <ModalBody className="pb-6">
                            <div className="p-6 rounded-lg">
                                <form className="space-y-4" onSubmit={handleSubmit(sendForm)}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                                            Título
                                        </label>
                                        <Input
                                            placeholder="Nome do produto"
                                            variant="bordered"
                                            className="w-full dark:text-white"
                                            isRequired
                                            {...register('title')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                                            Descrição
                                        </label>
                                        <Textarea
                                            placeholder="Descrição do produto"
                                            variant="bordered"
                                            minRows={3}
                                            className="w-full dark:text-white"
                                            isRequired
                                            {...register('description')}
                                        />
                                    </div>

                                    {
                                        !product && <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                                                Arquivo
                                            </label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="w-full"
                                                {...register("thumbnail")}
                                                isRequired
                                            />
                                        </div>
                                    }

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className="bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <LoaderCircle className="w-5 h-5 animate-spin" />
                                                    <span>Aguarde...</span>
                                                </>
                                            ) : (
                                                <span>{product ? 'Editar produto' : 'Criar produto'}</span>
                                            )}



                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}