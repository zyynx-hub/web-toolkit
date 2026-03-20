import ProjectModal from "@/components/ProjectModal"
import CodexLayout from "@/app/codex/layout"
import CodexPage from "@/app/codex/page"

export default function CodexModal() {
  return (
    <ProjectModal>
      <CodexLayout>
        <CodexPage />
      </CodexLayout>
    </ProjectModal>
  )
}
