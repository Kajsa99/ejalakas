import ExhibitionsGrid from "@/app/(site)/exhibitions/exhibitions-grid"
import UpcomingExhibitions from "@/app/(site)/exhibitions/upcoming-exhibitions"
import Newsletter from "@/components/newletter"

export default function Page() {
  return (
    <div className="site-page">
      <div className="site-intro">
        <div>
          <p className="eyebrow mb-4 text-foreground">E. Jalakas / På gång</p>
          <h1 className="page-heading">Utställningar</h1>
        </div>
        <p className="site-intro-copy">Kommande och avslutade utställningar.</p>
      </div>
      <div className="w-full pt-12">
        <UpcomingExhibitions />
        <ExhibitionsGrid />
      </div>
      <Newsletter />
    </div>
  )
}
