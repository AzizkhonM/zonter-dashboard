-- CreateIndex
CREATE INDEX "OrganizationRequest_reviewedById_idx" ON "OrganizationRequest"("reviewedById");

-- AddForeignKey
ALTER TABLE "OrganizationRequest" ADD CONSTRAINT "OrganizationRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
