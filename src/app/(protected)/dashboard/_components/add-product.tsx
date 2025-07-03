'use client'

import { api } from "@/app/lib/api";
import { Button, useDisclosure, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import ModalForm from "./modal-form";

export default function AddProduct() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const schemaForm = z.object({
        name: z.string().min(1, { message: 'campo obrigatório' }),
        description: z.string().min(1, { message: 'campo obrigatório' }),
        image_url: z
            .custom<FileList>()
            .refine((file) => file && file.length === 1, {
                message: "Imagem obrigatória"
            })
    });


    type schemaForm = z.infer<typeof schemaForm>

    const { register, handleSubmit, formState: { errors } } = useForm<schemaForm>({
        resolver: zodResolver(schemaForm),
        defaultValues: {
            name: '',
            description: '',
        }
    })

    const router = useRouter();


    async function sendForm(values: schemaForm) {
        const token = getCookie("token");

        const formData = new FormData();
        formData.append("title", values.name);
        formData.append("description", values.description);
        formData.append("thumbnail", values.image_url[0]);

        try {
          await api.post("/products", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onOpenChange();
            router.refresh();
        } catch (error) {
            addToast({
                title: "Erro ao criar produto",
                color: "danger"
            })
        }
    }


    return (
        <>
            <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produtos</h1>
                    </div>
                    <Button
                        onPress={onOpen}
                        className="bg-black text-white dark:bg-white dark:text-gray-900"
                        startContent={<Plus size={16} />}
                    >
                        Novo Produto
                    </Button>
                </div>
            </div>

            <ModalForm isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    )
}

