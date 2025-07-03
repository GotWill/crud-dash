'use client'

import { api } from "@/app/lib/api";
import {
    addToast,
    Button,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@heroui/react"; import { getCookie } from "cookies-next";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalForm from "./modal-form";
import { Product } from "@/app/types";


interface ProductCardProps {
    product: Product
}


export default function ProductCard({ product }: ProductCardProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenTrash, onOpen: onOpenTrash, onOpenChange: onOpenChangeTrash } = useDisclosure();



    const router = useRouter()

    async function handleDeleteCard() {
        try {
            const token = getCookie("token");
            await api.delete(`/products/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            addToast({
                title: "Produto deletado.",
                color: "success"
            })
            onOpenChangeTrash
            router.refresh()

        } catch (error) {
            addToast({
                title: "Error ao deletar produto",
                color: "danger"
            })
        }
    }

    return (
        <Card key={product.id} className="overflow-hidden">
            <CardBody className="p-0">
                <div className="h-48 bg-gray-200 flex items-center justify-center"></div>
                <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 dark:text-white">
                        {product.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 dark:text-white">
                        {product.description}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="bordered"
                            startContent={<Edit size={16} />}
                            onPress={onOpen}
                        >
                            Editar
                        </Button>
                        <Button
                            size="sm"
                            color="danger"
                            startContent={<Trash2 size={16} />}
                            onPress={onOpenTrash}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
                <ModalForm isOpen={isOpen} onOpenChange={onOpenChange} product={product} />

                <Modal backdrop="blur" isOpen={isOpenTrash} onOpenChange={onOpenChangeTrash}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col dark:text-white">Confirmar exclusão</ModalHeader>
                                <ModalBody>
                                    <p className="dark:text-white">
                                        Tem certeza de que deseja excluir o produto?
                                        Essa ação não pode ser desfeita.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" variant="light" onPress={onClose}>
                                        Fechar
                                    </Button>
                                    <Button color="danger" onPress={handleDeleteCard}>
                                        Deletar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </CardBody>
        </Card>
    );
}

