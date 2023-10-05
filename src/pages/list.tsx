import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DELETE_SUCCESS, FAILURE_PREFIX } from "../constants/string";
import { request } from "../utils/network";
import { BoardMetaData } from "../utils/types";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import board from "../redux/board";

const ListScreen = () => {
    /**
     * @todo [Step 5] 请在下述一处代码缺失部分填写合适的代码，完成游戏记录列表页面 UI
     * @todo [Step 6] 请在下述一处代码缺失部分填写合适的代码，完成网络请求的管理
     */
    const userName = useSelector((state: RootState) => state.auth.name);

    const [refreshing, setRefreshing] = useState(true);
    const [selectedUserName, setSelectedUserName] = useState<string | undefined>(undefined);
    const [boardList, setBoardList] = useState<BoardMetaData[]>([]);

    const router = useRouter();
    const query = router.query;

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        const name = router.query.name && decodeURIComponent(router.query.name as string);
        setSelectedUserName(name);
        fetchList(name);
    }, [router, query]);

    const fetchList = (name?: string) => {
        setRefreshing(true);
        request(name ? `/api/user/${name}` : "/api/boards", "GET", false)
            .then((res) => setBoardList(res.boards))
            .catch((err) => alert(FAILURE_PREFIX + err))
            .finally(() => setRefreshing(false));
    };

    const deleteBoard = (id: number) => {
        // Step 6 BEGIN
        request(`/api/boards/${id}`, "DELETE", true)
            .then((res)=>{
                if(res.code === undefined){
                    alert(DELETE_SUCCESS);
                }
            })
            .catch((err)=>{alert(FAILURE_PREFIX + err);})
            .finally(()=>{fetchList();});
        // Step 6 END
    };

    return refreshing ? (
        <p> Loading... </p>
    ) : (
        <>
            {selectedUserName !== undefined && <h4> Boards of {selectedUserName} </h4>}
            <button onClick={() => router.push("/")}>
                Go back to free mode
            </button>
            {selectedUserName !== undefined && (
                <button onClick={() => router.push("/list")}>
                    Go to full list
                </button>
            )}
            {boardList.length === 0 ? (
                <p> Empty list. </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>{
                    // Step 5 BEGIN
                    boardList.map((boardMeta)=>{
                        const date = new Date(boardMeta.createdAt * 1000);
                        const year = date.getFullYear();
                        const month = date.getMonth()+1;
                        const day = date.getDay();
                        const createdAtDate = `${year}/${month}/${day}`;
                       return <div style={{display : "flex", flexDirection:"column"}} key={boardMeta.id}>
                        <span>ID: {boardMeta.id}</span>
                        <span>Name: {boardMeta.boardName}</span>
                        <span>Created By: {boardMeta.userName}</span>
                        <span>Created At: {createdAtDate}</span>
                        <div style={{display: "flex", flexDirection: "row"}} key={boardMeta.id}>
                            <button onClick={()=>{router.push(`/?id=${boardMeta.id}`);}}>
                                Play it
                            </button>
                            {userName === boardMeta.userName &&
                                <button onClick={()=>{deleteBoard(boardMeta.id);}}>
                                    Delete it
                                </button>
                            }
                            <button onClick={()=>{router.push(`/list?name=${boardMeta.userName}`);}}>
                                View this user
                            </button>
                        </div>
                       </div>;
                    })
                    // Step 5 END
                }</div>
            )}
        </>
    );
};

export default ListScreen;