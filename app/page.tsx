"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, Moon, Sun, X, Edit, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UXMethod {
  id: number
  title: string
  description: string
  tags: string[]
  isNew?: boolean
}

const initialMethods: UXMethod[] = [
  {
    id: 1,
    title: "Design Thinking",
    description:
      "Processo centrado no usuário que combina empatia, criatividade e racionalidade para atender às necessidades dos usuários e ao sucesso do negócio.",
    tags: ["processo", "criatividade", "empatia", "inovação"],
  },
  {
    id: 2,
    title: "User Journey Mapping",
    description:
      "Visualização do processo que uma pessoa passa para atingir um objetivo, identificando pontos de dor e oportunidades de melhoria.",
    tags: ["mapeamento", "jornada", "visualização", "experiência"],
  },
  {
    id: 3,
    title: "Personas",
    description:
      "Representações fictícias dos usuários ideais baseadas em dados reais e pesquisa, ajudando a entender necessidades e comportamentos.",
    tags: ["usuário", "pesquisa", "comportamento", "segmentação"],
  },
  {
    id: 4,
    title: "A/B Testing",
    description:
      "Método de comparação entre duas versões de um elemento para determinar qual performa melhor em termos de conversão.",
    tags: ["teste", "conversão", "otimização", "dados"],
  },
  {
    id: 5,
    title: "Card Sorting",
    description:
      "Técnica para entender como os usuários categorizam informações, ajudando na criação de arquiteturas de informação intuitivas.",
    tags: ["categorização", "arquitetura", "informação", "usabilidade"],
  },
  {
    id: 6,
    title: "Wireframing",
    description:
      "Criação de esquemas visuais básicos que mostram a estrutura e layout de uma interface antes do design final.",
    tags: ["estrutura", "layout", "prototipagem", "interface"],
  },
  {
    id: 7,
    title: "Usability Testing",
    description:
      "Avaliação de um produto através da observação de usuários reais tentando completar tarefas específicas.",
    tags: ["teste", "usabilidade", "observação", "validação"],
  },
  {
    id: 8,
    title: "Heuristic Evaluation",
    description:
      "Método de avaliação de usabilidade onde especialistas examinam a interface usando princípios de usabilidade estabelecidos.",
    tags: ["avaliação", "heurística", "especialistas", "princípios"],
  },
]

interface Notification {
  id: number
  type: "success" | "error"
  message: string
}

export default function UXMethodsGallery() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [methods, setMethods] = useState<UXMethod[]>(initialMethods)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [editingMethod, setEditingMethod] = useState<UXMethod | null>(null)

  // Form states
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formTags, setFormTags] = useState<string[]>([])

  const availableTags = ["processo", "criatividade", "pesquisa", "teste", "design", "análise", "usuário", "dados"]

  const filteredMethods = useMemo(() => {
    if (!searchTerm) return methods

    return methods.filter(
      (method) =>
        method.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, methods])

  const addNotification = (type: "success" | "error", message: string) => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  const handleCardClick = (id: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const openAddModal = () => {
    setEditingMethod(null)
    setFormTitle("")
    setFormDescription("")
    setFormTags([])
    setIsModalOpen(true)
  }

  const openEditModal = (method: UXMethod, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingMethod(method)
    setFormTitle(method.title)
    setFormDescription(method.description)
    setFormTags(method.tags)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formTitle.trim() || !formDescription.trim() || formTags.length === 0) {
      addNotification("error", "Por favor, preencha todos os campos obrigatórios")
      return
    }

    if (editingMethod) {
      // Editar método existente
      setMethods((prev) =>
        prev.map((method) =>
          method.id === editingMethod.id
            ? { ...method, title: formTitle, description: formDescription, tags: formTags }
            : method,
        ),
      )
      addNotification("success", "Método editado com sucesso!")
    } else {
      // Adicionar novo método
      const newMethod: UXMethod = {
        id: Date.now(),
        title: formTitle,
        description: formDescription,
        tags: formTags,
        isNew: true,
      }

      setMethods((prev) => [newMethod, ...prev])
      addNotification("success", "Método adicionado com sucesso!")

      // Remove a tag "novo" após 10 segundos
      setTimeout(() => {
        setMethods((prev) => prev.map((method) => (method.id === newMethod.id ? { ...method, isNew: false } : method)))
      }, 10000)
    }

    setIsModalOpen(false)
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setFormTags((prev) => [...prev, tag])
    } else {
      setFormTags((prev) => prev.filter((t) => t !== tag))
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {notification.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        {/* Buttons */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={openAddModal}
              className={`${isDarkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}
            >
              adicionar método
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`${isDarkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Qual o método de UX você precisa saber?</h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div
            className={`relative rounded-full border-2 ${
              isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
            }`}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar métodos de UX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-12 pr-4 py-3 rounded-full border-0 focus:ring-0 ${
                isDarkMode
                  ? "bg-transparent text-white placeholder-gray-400"
                  : "bg-transparent text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>
      </header>

      {/* Cards Gallery */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMethods.map((method) => (
            <div
              key={method.id}
              className="card-container h-64 cursor-pointer relative"
              onClick={() => handleCardClick(method.id)}
            >
              {/* Tag "novo" */}
              {method.isNew && (
                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  novo
                </div>
              )}

              <div className={`card ${flippedCards.has(method.id) ? "flipped" : ""}`}>
                {/* Front of card */}
                <div
                  className={`card-face card-front ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  } border-2 rounded-lg p-6 flex items-center justify-center`}
                >
                  <h3 className="text-xl font-semibold text-center">{method.title}</h3>
                </div>

                {/* Back of card */}
                <div
                  className={`card-face card-back ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  } border-2 rounded-lg p-6 ${flippedCards.has(method.id) ? "card-hover-effect" : ""}`}
                >
                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => openEditModal(method, e)}
                    className={`absolute top-2 right-2 h-8 w-8 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <h3 className="text-lg font-semibold mb-3 pr-10">{method.title}</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {method.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {method.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMethods.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Nenhum método encontrado para "{searchTerm}"
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md rounded-lg p-6 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingMethod ? "editar método de UX" : "adicionar método de UX"}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <Input
                  type="text"
                  placeholder="Nome do método"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição *</label>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  escreva sobre o que é o método
                </p>
                <textarea
                  rows={4}
                  placeholder="Descreva o método de UX..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags *</label>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  selecione as categorias relacionadas
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={formTags.includes(tag)}
                        onChange={(e) => handleTagChange(tag, e.target.checked)}
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 ${
                    isDarkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {editingMethod ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>
        {`
.card-container {
  perspective: 1000px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-back {
  transform: rotateY(180deg);
  justify-content: flex-start !important;
}

.card-hover-effect {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.card-hover-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(252, 0, 255, 0.4), transparent);
  transition: left 0.5s;
  z-index: 1;
}

.card-hover-effect:hover::before {
  left: 100%;
}

.card-hover-effect::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(-45deg, #fc00ff, #00dbde, #fc00ff, #00dbde);
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  animation: glowing 20s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

.card-hover-effect:hover::after,
.card-hover-effect::after {
  opacity: 1;
}

@keyframes glowing {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}
`}
      </style>
    </div>
  )
}
