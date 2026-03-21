import ProjectModal from "@/components/ProjectModal"
import LockedProjectGate from "@/components/LockedProjectGate"
import SPSSLayout from "@/app/spss/layout"
import { SPSSPageContent } from "@/app/spss/page"

export default function SPSSModal() {
  return (
    <ProjectModal>
      <LockedProjectGate
        slug="spss"
        password="cbs2026"
        title="SPSS-Migratie"
        color="#F97316"
        year="2026"
        type="Enterprise Tool"
        tags={["Python", "PowerShell", "SPSS"]}
      >
        <SPSSLayout>
          <SPSSPageContent />
        </SPSSLayout>
      </LockedProjectGate>
    </ProjectModal>
  )
}
