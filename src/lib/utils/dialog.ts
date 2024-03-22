export function openModal(modalId: string)
{
    const modalEl: any = document.getElementById(modalId);
    modalEl.showModal();
}