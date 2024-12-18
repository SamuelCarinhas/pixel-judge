import HomeSectionCard from "../components/cards/HomeSectionCard";
import PageContainer from "../components/containers/PageContainer";

export default function HomePage() {
    return (
        <PageContainer>
            <div className="pr-10 pl-10 max-w-7xl w-full flex flex-col gap-16 pt-16 pb-16">
                <section className="w-full challenges flex flex-row justify-between">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-white text-xl font-semibold">Prepare your self</h1>
                        <HomeSectionCard title="Challenges" description="List of all challenges for practice" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-white text-xl font-semibold">Month Journey</h1>
                        <HomeSectionCard title="Advent Journey" description="25 Unique thematic christmas challenges" />
                    </div>
                </section>
                <div className="w-full challenges flex flex-col gap-3">
                    <h1 className="text-white text-xl font-semibold">Contests</h1>
                    <div className="flex flex-row gap-6 flex-wrap">
                        <HomeSectionCard title="Beta Round #1" description="Beta contest" />
                        <HomeSectionCard title="Beta Round #2" description="Beta contest" />
                        <HomeSectionCard title="Beta Round #3" description="Beta contest" />
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}