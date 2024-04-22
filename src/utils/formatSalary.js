export const formatSalary = (salary) => {
    const salaryString = String(salary);
    const numericSalary = salaryString.replace(/[^\d]/g, '');
    const salaryValue = parseFloat(numericSalary);
    if (salaryValue >= 100000) {
        const lakhs = salaryValue / 100000;
        return `${lakhs.toFixed(1)} L`;
    } else if (salaryValue >= 1000) {
        const thousands = salaryValue / 1000;
        return `${thousands.toFixed(1)} K`;
    } else {
        return `${salaryValue}`;
    }
}

export const getSalaryTypeSuffix = (salaryTypeSlug)=> {
    if (salaryTypeSlug === "years") {
        return " per annum";
    } else if (salaryTypeSlug === "months") {
        return "per month";
    } else if (salaryTypeSlug === "weeks"){
        return "per week";
    } else {
        return;
    }
}
