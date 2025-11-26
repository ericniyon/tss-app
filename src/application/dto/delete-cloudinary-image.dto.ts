import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCloudinaryImageDto {
    @ApiProperty({
        description: 'Cloudinary public ID or full URL of the image to delete',
        example: 'image_public_id',
    })
    @IsNotEmpty()
    @IsString()
    publicId: string;
}

