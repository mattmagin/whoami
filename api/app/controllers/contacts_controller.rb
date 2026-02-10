class ContactsController < ApplicationController
  def create
    contact = Contact.new(contact_params)

    if contact.save
      ContactMailer.notification(contact).deliver_later
      render json: { message: "Message sent successfully" }, status: :created
    else
      render_invalid(contact.errors.full_messages.join(", "))
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end
end
