type IPathInfo = {
    url:string
    title:string
}

type IPath = {
    [p:string]:IPathInfo
}

export const PATH:IPath= {
    page:{ url:"/", title: "Calendar Test" },
}