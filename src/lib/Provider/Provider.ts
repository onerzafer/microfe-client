export const Provide = (name: string, provideable: any) => ({
    name,
    initialize: () => provideable,
});