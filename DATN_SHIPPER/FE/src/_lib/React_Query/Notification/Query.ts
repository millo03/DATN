import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { add_Notification, delete_Notification, get_Notification_By_User, getAll_Notification, update_Notification } from "../../Notification/Message";

export function Query_notification(userId?: string | number, role?: string) {
    const { data, ...rest } = useQuery({
        queryKey: userId ? ['Notification_Key', userId, role] : ['Notification_Key'],
        queryFn: async () => {
            if (role === "admin") {
                return await getAll_Notification(role)
            } else if (userId) {
                return await get_Notification_By_User(userId);
            }
        },
        enabled: !!userId || role === 'admin'
    });
    return { data, ...rest }
}


type Action = 'Add' | 'Remove' | 'Send';
export function Mutation_Notification(action: Action) {
    const queryClient = useQueryClient();
    const { mutate, ...rest } = useMutation({
        mutationFn: async (dataBody: any) => {
            switch (action) {
                case 'Add':
                    return await add_Notification(dataBody);
                case 'Send':
                    return await update_Notification(dataBody);
                case 'Remove':
                    return await delete_Notification(dataBody);
                default: return null;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['Notification_Key']
            })
        },
        onError: (res) => res
    });
    return { mutate, ...rest }
}