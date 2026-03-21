import ProjectModal from "@/components/ProjectModal"
import LockedProjectGate from "@/components/LockedProjectGate"
import BrendaLayout from "@/app/brenda/layout"
import { BrendaPageContent } from "@/app/brenda/page"

export default function BrendaModal() {
  return (
    <ProjectModal>
      <LockedProjectGate
        slug="brenda"
        password="brenda2026"
        title="Brenda's Hairstyle"
        color="#EC4899"
        year="2026"
        type="Website Redesign"
        tags={["Next.js", "Framer Motion", "Tailwind CSS"]}
      >
        <BrendaLayout>
          <BrendaPageContent />
        </BrendaLayout>
      </LockedProjectGate>
    </ProjectModal>
  )
}
