
export interface KatagoResult {
    isDuringSearch: boolean
    turnNumber: number
    moveInfos: Array<KatagoMoveInfo>
    rootInfo: KatagoRootInfo
    ownership: Array<number>
    policy: Array<number>
}

export interface KatagoRootInfo {
    scoreLead: number
    scoreSelfplay: number
    scoreStdev: number
    utility: number
    visits: number
    winrate: number
}

export interface KatagoMoveInfo {
    move: string
    visits: number
    winrate: number
    scoreMean: number
    scoreLead: number
    scoreSelfplay: number
    scoreStdev: number
    utility: number
    utilityLcb: number
    lcb: number
    prior: number
    order: number
    pvVisits: number
    pv: Array<string>
}

export interface SGFProperties {
    currentMove: number
    displayOwnership: boolean
    displayPolicy: boolean
}