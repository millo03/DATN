import { useQuery } from "@tanstack/react-query"
import { list_order } from "../../Orders/order"

export function Query_Order(dataClient : any) {
    const key = ['Order_Key', dataClient.id_user, dataClient.page, dataClient.limit, dataClient?.status]
    const {data, ...rest} = useQuery({
        queryKey : key,
        queryFn : () => list_order(dataClient),
        enabled : !!dataClient?.id_user
    })
    return {data, ...rest}
}