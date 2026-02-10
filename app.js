const basePromptInput = document.querySelector("#basePrompt");
const audienceInput = document.querySelector("#audience");
const languageInput = document.querySelector("#language");
const contextInput = document.querySelector("#context");
const toneSelect = document.querySelector("#tone");
const lengthSelect = document.querySelector("#length");
const formatSelect = document.querySelector("#format");
const roleInput = document.querySelector("#role");
const constraintsInput = document.querySelector("#constraints");
const includeExampleToggle = document.querySelector("#includeExample");
const includeChecklistToggle = document.querySelector("#includeChecklist");
const resultOutput = document.querySelector("#result");
const generateBtn = document.querySelector("#generateBtn");
const copyBtn = document.querySelector("#copyBtn");
const copyHint = document.querySelector("#copyHint");

const defaultPrompt =
  "请以清晰、具体、可执行的方式生成内容，并在输出前确认已满足全部要求。";

const buildSection = (title, items) => {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return "";
  return `【${title}】\n${filtered.map((item) => `- ${item}`).join("\n")}`;
};

const buildOptimizedPrompt = () => {
  const basePrompt = basePromptInput.value.trim() || defaultPrompt;
  const audience = audienceInput.value.trim();
  const language = languageInput.value.trim() || "中文";
  const context = contextInput.value.trim();
  const tone = toneSelect.value;
  const length = lengthSelect.value;
  const format = formatSelect.value;
  const role = roleInput.value.trim();
  const constraints = constraintsInput.value.trim();
  const includeExample = includeExampleToggle.checked;
  const includeChecklist = includeChecklistToggle.checked;

  const header = `你是一名${role || "经验丰富的内容专家"}。请将用户的原始需求优化为更高质量的提示词，并基于该提示词完成输出。`;
  const objective = `原始需求：${basePrompt}`;

  const requirements = buildSection("输出要求", [
    `语气风格：${tone}`,
    `输出语言：${language}`,
    `输出长度：${length}`,
    `呈现格式：${format}`,
    audience && `目标受众：${audience}`,
    context && `补充背景：${context}`,
    constraints && `约束条件：${constraints}`,
  ]);

  const qualityChecklist = includeChecklist
    ? buildSection("自检清单", [
        "是否明确表达了任务目标和关键受众?",
        "是否覆盖必要背景且没有遗漏约束?",
        "输出结构是否符合指定格式并易于执行?",
      ])
    : "";

  const exampleSection = includeExample
    ? buildSection("示例输出", [
        "给出 1 个符合上述要求的简短示例，以便用户参考。",
      ])
    : "";

  return [header, objective, requirements, qualityChecklist, exampleSection]
    .filter(Boolean)
    .join("\n\n");
};

const updateResult = () => {
  resultOutput.value = buildOptimizedPrompt();
  copyHint.textContent = "";
};

generateBtn.addEventListener("click", updateResult);

copyBtn.addEventListener("click", async () => {
  if (!resultOutput.value.trim()) {
    updateResult();
  }

  try {
    await navigator.clipboard.writeText(resultOutput.value);
    copyHint.textContent = "已复制到剪贴板。";
  } catch (error) {
    copyHint.textContent = "复制失败，请手动选择文本。";
  }
});
