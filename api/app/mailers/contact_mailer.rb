class ContactMailer < ApplicationMailer
  def notification(contact)
    @contact = contact

    mail(
      to: ENV.fetch("CONTACT_NOTIFICATION_EMAIL"),
      reply_to: @contact.email,
      subject: "New contact message from #{@contact.name}"
    )
  end
end
