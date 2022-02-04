"use strict";

var fs = require("fs");

var PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  var doc = new PDFDocument({
    size: "A4",
    margin: 50
  });
  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc, invoice);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, invoice) {
  doc.image(invoice.logo, 50, 45, {
    width: 50
  }).fillColor("#444444").fontSize(20).text(invoice.establishment, 110, 55).fontSize(12.5).text(invoice.branch, 110, 80).fontSize(10).text(invoice.company_email, 200, 50, {
    align: "right"
  }).text(invoice.address, 200, 65, {
    align: "right"
  }).moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("RECIEPT", 50, 160);
  generateHr(doc, 185);
  var customerInformationTop = 200;
  doc.fontSize(10).text("ORDER-ID", 50, customerInformationTop).font("Helvetica-Bold").text(invoice.order_ref, 150, customerInformationTop).font("Helvetica").text("DATE", 50, customerInformationTop + 17).text(invoice.date, 150, customerInformationTop + 17).text("TOTAL AMOUNT", 50, customerInformationTop + 35).text(formatCurrency(invoice.subtotal - invoice.discount), 150, customerInformationTop + 35).font("Helvetica-Bold").text("EMAIL ID", 300, customerInformationTop).font("Helvetica").text(invoice.client.email, 300, customerInformationTop + 17).moveDown();
  generateHr(doc, 256);
}

var endPosition = 0;

function generateInvoiceTable(doc, invoice) {
  var i;
  var invoiceTableTop = 330;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Item", "", "Unit Cost", "Quantity", "Total");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    var item = invoice.items[i];
    var position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, position, item.item, "", formatCurrency(item.amount / item.quantity), item.quantity, formatCurrency(item.amount));
    generateHr(doc, position + 20);
  }

  var subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(doc, subtotalPosition, "", "", "Subtotal", "", formatCurrency(invoice.subtotal));
  var paidToDatePosition = subtotalPosition + 20;
  generateTableRow(doc, paidToDatePosition, "", "", "Discount", "", formatCurrency(invoice.discount));
  var duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, duePosition, "", "", "Total Payable", "", formatCurrency(invoice.subtotal - invoice.discount));
  doc.font("Helvetica");
  generateFooter(doc, duePosition);
}

function generateFooter(doc) {
  var duePosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (duePosition > 0) {
    doc.fontSize(10).text("Thank you for visiting us. Become a member of our exclusive community by downloading the syra app and enjoy the VIP service. You can also find us online at www.syra-sharafa.com", 180, duePosition + 250, {
      align: "center",
      width: 250
    });
  }
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc.fontSize(10).text(item, 50, y).text(description, 150, y).text(unitCost, 280, y, {
    width: 90,
    align: "right"
  }).text(quantity, 370, y, {
    width: 90,
    align: "right"
  }).text(lineTotal, 0, y, {
    align: "right"
  });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "€  " + cents.toFixed(2);
}

function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice: createInvoice
};