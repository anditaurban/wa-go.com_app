pagemodule = "Campaign log";
//console.log(pagemodule);
colSpanCount = 9;

setDataType("logcampaign");

h1Element = document.querySelector(".section-header h1");
if (h1Element) {
  h1Element.textContent = detail_desc;
}

window.rowTemplate = function (item, index) {
  return `
        <tr class="flex flex-col mb-4 rounded-lg shadow-md border sm:table-row sm:mb-0 sm:border-none sm:shadow-none">
            <td class="px-6 py-4 text-sm font-medium text-gray-900 break-words whitespace-normal sm:table-cell sm:border-b-0">
                ${index + 1}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 break-words whitespace-normal sm:table-cell sm:border-b-0">
                ${item.date_time}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 break-words whitespace-normal sm:table-cell sm:border-b-0">
                ${item.cs_admin}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 break-words whitespace-normal sm:table-cell sm:border-b-0">
                ${item.text}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 break-words whitespace-normal sm:table-cell sm:border-b-0">
                ${item.status}
            </td>
            <td class="px-6 py-4 text-sm font-medium text-right break-words whitespace-normal sm:table-cell sm:border-b-0">
                <button onclick="handleDelete(${
                  item.cd_id
                }, '${detail_id}')" class="text-red-600 hover:text-red-900 deleteButton" data-id="${
    item.cd_id
  }">Delete</button>
            </td>
        </tr>
    `;
};
