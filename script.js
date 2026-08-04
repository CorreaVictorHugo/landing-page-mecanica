const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const syncHeader = () => header?.classList.toggle("scrolled", window.scrollY > 24);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const closeMenu = () => {
  menu?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menu.classList.toggle("open", !open);
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
  document.body.classList.toggle("menu-open", !open);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll(".service-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".service-list details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.nome;
  const phone = form.elements.telefone;
  const message = form.elements.mensagem;
  const phoneDigits = phone.value.replace(/\D/g, "");

  name.closest(".field").classList.toggle("invalid", name.value.trim().length < 2);
  phone.closest(".field").classList.toggle("invalid", phoneDigits.length < 10);

  if (name.value.trim().length < 2 || phoneDigits.length < 10) {
    formStatus.textContent = "Revise os campos indicados para continuar.";
    formStatus.classList.add("error");
    form.querySelector(".invalid input")?.focus();
    return;
  }

  const whatsappNumber = "";
  if (!whatsappNumber) {
    formStatus.textContent =
      "Formulário validado. Configure o número oficial no arquivo script.js para ativar o WhatsApp.";
    formStatus.classList.add("error");
    return;
  }

  const text = [
    `Olá, meu nome é ${name.value.trim()}.`,
    `Telefone: ${phone.value.trim()}.`,
    message.value.trim() || "Gostaria de agendar uma revisão.",
  ].join("\n");

  formStatus.classList.remove("error");
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
