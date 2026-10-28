const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const messagePreview = document.querySelector("[data-message-preview]");
const messageOutput = document.querySelector("[data-message-output]");
const copyMessage = document.querySelector("[data-copy-message]");

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

form?.addEventListener("input", (event) => {
  if (event.target.matches("input")) {
    event.target.closest(".field").classList.remove("invalid");
    event.target.removeAttribute("aria-invalid");
  }
  messagePreview.hidden = true;
  formStatus.textContent = "Demonstração local: nenhum dado é armazenado ou enviado.";
  formStatus.classList.remove("error");
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.nome;
  const phone = form.elements.telefone;
  const message = form.elements.mensagem;
  const phoneDigits = phone.value.replace(/\D/g, "");
  const invalidName = name.value.trim().length < 2;
  const invalidPhone = phoneDigits.length < 10;

  name.closest(".field").classList.toggle("invalid", invalidName);
  phone.closest(".field").classList.toggle("invalid", invalidPhone);
  name.setAttribute("aria-invalid", String(invalidName));
  phone.setAttribute("aria-invalid", String(invalidPhone));

  if (invalidName || invalidPhone) {
    messagePreview.hidden = true;
    formStatus.textContent = "Revise os campos indicados para continuar.";
    formStatus.classList.add("error");
    form.querySelector(".invalid input")?.focus();
    return;
  }

  messageOutput.value = [
    `Olá, meu nome é ${name.value.trim()}.`,
    `Telefone: ${phone.value.trim()}.`,
    message.value.trim() || "Gostaria de agendar uma revisão.",
  ].join("\n");

  messagePreview.hidden = false;
  formStatus.textContent = "Mensagem gerada apenas neste navegador. Você pode copiá-la abaixo.";
  formStatus.classList.remove("error");
});

copyMessage?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(messageOutput.value);
    formStatus.textContent = "Mensagem copiada.";
  } catch {
    messageOutput.focus();
    messageOutput.select();
    formStatus.textContent = "Selecione a mensagem e copie manualmente.";
  }
});
