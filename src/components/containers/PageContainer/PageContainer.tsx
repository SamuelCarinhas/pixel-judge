import IPageContainer from "./IPageContainer.ts";

export default function PageContainer(props: IPageContainer) {

    return (
        <div>
            <div>navbar</div>
            <div>
                {props.children}
            </div>
            <div>footer</div>
        </div>
    )
}
